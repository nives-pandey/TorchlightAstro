import type { Express } from "express";
import { pdfReportGenerator } from "./pdf-generator";
import { emailService } from "./email-service";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";

export function registerReportRoutes(app: Express) {
  // Generate PDF Report
  app.post("/api/reports/pdf", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { chartId, partnerChartId, reportType = 'personal', branding = 'mytorchlight' } = req.body;

      // Get user data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get chart data
      const chart = await storage.getChart(chartId);
      if (!chart) {
        return res.status(404).json({ message: "Chart not found" });
      }

      const birthData = await storage.getBirthData(chart.birthDataId);
      if (!birthData) {
        return res.status(404).json({ message: "Birth data not found" });
      }

      // Get partner data if compatibility report
      let partnerChart, partnerBirthData;
      if (partnerChartId) {
        partnerChart = await storage.getChart(partnerChartId);
        if (partnerChart) {
          partnerBirthData = await storage.getBirthData(partnerChart.birthDataId);
        }
      }

      // Generate system comparisons
      const systemComparisons = [
        {
          system: "Western Astrology",
          accuracy: 92,
          insights: ["Strong leadership qualities", "Creative expression", "Communication gifts"],
          recommendations: ["Focus on artistic pursuits", "Develop leadership skills", "Express creativity"],
          compatibility: partnerChart ? 87 : undefined
        },
        {
          system: "Vedic (Jyotish)",
          accuracy: 96,
          insights: ["Hasta nakshatra precision", "Teaching abilities", "Healing potential"],
          recommendations: ["Study traditional knowledge", "Practice meditation", "Serve others"],
          compatibility: partnerChart ? 94 : undefined
        },
        {
          system: "Chinese Zodiac",
          accuracy: 89,
          insights: ["Wood element growth", "Dragon energy", "Leadership nature"],
          recommendations: ["Embrace growth opportunities", "Lead with wisdom", "Stay grounded"],
          compatibility: partnerChart ? 82 : undefined
        },
        {
          system: "Human Design",
          accuracy: 85,
          insights: ["Generator energy", "Sacral authority", "Building energy"],
          recommendations: ["Follow your gut", "Build sustainable projects", "Work with others"],
          compatibility: partnerChart ? 91 : undefined
        },
        {
          system: "Numerology",
          accuracy: 78,
          insights: ["Life Path 3", "Creative expression", "Communication master"],
          recommendations: ["Use your voice", "Create inspiring content", "Connect with others"],
          compatibility: partnerChart ? 76 : undefined
        }
      ];

      // Generate PDF
      const pdfResult = await pdfReportGenerator.generateReport({
        userChart: chart,
        birthData,
        user,
        partnerChart,
        partnerBirthData,
        systemComparisons,
        reportType: reportType as any,
        branding: branding as any
      });

      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${pdfResult.fileName}"`);
      res.setHeader('Content-Length', pdfResult.pdfBuffer.length);

      res.send(pdfResult.pdfBuffer);

    } catch (error) {
      console.error("PDF generation error:", error);
      res.status(500).json({ message: "Failed to generate PDF report" });
    }
  });

  // Email Report
  app.post("/api/reports/email", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { chartId, reportType = 'personal', scheduleFor } = req.body;

      // Get user data
      const user = await storage.getUser(userId);
      if (!user || !user.email) {
        return res.status(404).json({ message: "User email not found" });
      }

      // Generate PDF first
      const chart = await storage.getChart(chartId);
      const birthData = await storage.getBirthData(chart.birthDataId);
      
      const systemComparisons = [
        {
          system: "Western Astrology",
          accuracy: 92,
          insights: ["Leadership qualities", "Creative expression"],
          recommendations: ["Focus on artistic pursuits", "Develop leadership"]
        },
        {
          system: "Vedic (Jyotish)",
          accuracy: 96,
          insights: ["Teaching abilities", "Healing potential"],
          recommendations: ["Study traditional knowledge", "Practice meditation"]
        }
      ];

      const pdfResult = await pdfReportGenerator.generateReport({
        userChart: chart,
        birthData,
        user,
        systemComparisons,
        reportType: reportType as any,
        branding: 'mytorchlight'
      });

      // Send email with PDF attachment
      const systemsAnalyzed = systemComparisons.map(s => s.system);
      const scheduleDate = scheduleFor ? new Date(scheduleFor) : undefined;

      const emailResult = await emailService.scheduleReport(
        user,
        pdfResult.pdfBuffer,
        reportType,
        systemsAnalyzed,
        scheduleDate || new Date()
      );

      res.json({
        success: emailResult.success,
        scheduledId: emailResult.scheduledId,
        fileName: pdfResult.fileName,
        scheduledFor: scheduleDate
      });

    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ message: "Failed to send email report" });
    }
  });

  // Get Report Status
  app.get("/api/reports/status/:reportId", isAuthenticated, async (req, res) => {
    try {
      const { reportId } = req.params;
      
      // In production, this would check the actual report generation/email status
      res.json({
        reportId,
        status: 'completed',
        generatedAt: new Date(),
        downloadUrl: `/api/reports/download/${reportId}`,
        emailSent: true
      });

    } catch (error) {
      console.error("Report status error:", error);
      res.status(500).json({ message: "Failed to get report status" });
    }
  });

  // List User Reports
  app.get("/api/reports/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // In production, this would fetch from a reports database table
      const mockReports = [
        {
          id: 'report_1',
          type: 'personal',
          generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          status: 'completed',
          fileName: 'personal_analysis.pdf',
          systemsCount: 5
        },
        {
          id: 'report_2',
          type: 'compatibility',
          generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'completed',
          fileName: 'compatibility_analysis.pdf',
          systemsCount: 5
        }
      ];

      res.json(mockReports);

    } catch (error) {
      console.error("Report history error:", error);
      res.status(500).json({ message: "Failed to get report history" });
    }
  });

  // Download Report
  app.get("/api/reports/download/:reportId", isAuthenticated, async (req, res) => {
    try {
      const { reportId } = req.params;
      
      // In production, this would fetch the actual stored PDF
      res.json({
        downloadUrl: `/reports/${reportId}.pdf`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });

    } catch (error) {
      console.error("Report download error:", error);
      res.status(500).json({ message: "Failed to download report" });
    }
  });
}