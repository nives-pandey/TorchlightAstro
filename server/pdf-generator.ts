import { Chart, BirthData, User } from "@shared/schema";

interface PDFReportOptions {
  userChart: Chart;
  birthData: BirthData;
  user: User;
  partnerChart?: Chart;
  partnerBirthData?: BirthData;
  systemComparisons: SystemAnalysis[];
  reportType: 'personal' | 'compatibility' | 'detailed';
  branding: 'mytorchlight' | 'whitelabel';
  customBranding?: {
    logo?: string;
    colors?: { primary: string; secondary: string; };
    companyName?: string;
  };
}

interface SystemAnalysis {
  system: string;
  accuracy: number;
  insights: string[];
  recommendations: string[];
  compatibility?: number;
}

export class PDFReportGenerator {
  async generateReport(options: PDFReportOptions): Promise<{
    pdfBuffer: Buffer;
    fileName: string;
    metadata: {
      pageCount: number;
      fileSize: number;
      generatedAt: Date;
      reportId: string;
    };
  }> {
    const reportId = `torch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const generatedAt = new Date();
    
    // Generate HTML content for PDF conversion
    const htmlContent = this.generateHTMLContent(options, reportId, generatedAt);
    
    // Simulate PDF generation (would use libraries like puppeteer or pdfkit in production)
    const pdfBuffer = await this.htmlToPDF(htmlContent);
    
    const fileName = this.generateFileName(options, reportId);
    
    return {
      pdfBuffer,
      fileName,
      metadata: {
        pageCount: this.estimatePageCount(options),
        fileSize: pdfBuffer.length,
        generatedAt,
        reportId
      }
    };
  }

  private generateHTMLContent(options: PDFReportOptions, reportId: string, generatedAt: Date): string {
    const { userChart, birthData, user, systemComparisons, reportType, branding, customBranding } = options;
    
    const brandingConfig = this.getBrandingConfig(branding, customBranding);
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprehensive Astrological Analysis - ${user.firstName} ${user.lastName}</title>
    <style>
        ${this.getReportCSS(brandingConfig)}
    </style>
</head>
<body>
    ${this.generateHeader(brandingConfig, user, reportId)}
    ${this.generateCoverPage(options)}
    ${this.generateSystemComparisons(systemComparisons)}
    ${reportType === 'compatibility' ? this.generateCompatibilitySection(options) : ''}
    ${this.generateDetailedAnalysis(options)}
    ${this.generateFooter(brandingConfig, generatedAt)}
</body>
</html>`;
  }

  private getBrandingConfig(branding: string, customBranding?: any) {
    if (branding === 'whitelabel' && customBranding) {
      return {
        logo: customBranding.logo || '🔆',
        primaryColor: customBranding.colors?.primary || '#F59E0B',
        secondaryColor: customBranding.colors?.secondary || '#8B5CF6',
        companyName: customBranding.companyName || 'MyTorchlight',
        isCustom: true
      };
    }
    
    return {
      logo: '🔆',
      primaryColor: '#F59E0B',
      secondaryColor: '#8B5CF6',
      companyName: 'MyTorchlight',
      isCustom: false
    };
  }

  private generateHeader(branding: any, user: User, reportId: string): string {
    return `
    <header class="report-header">
        <div class="header-content">
            <div class="logo-section">
                <span class="logo">${branding.logo}</span>
                <span class="company-name">${branding.companyName}</span>
            </div>
            <div class="report-info">
                <h1>Comprehensive Astrological Analysis</h1>
                <h2>for ${user.firstName} ${user.lastName}</h2>
                <div class="report-id">Report ID: ${reportId}</div>
            </div>
        </div>
    </header>`;
  }

  private generateCoverPage(options: PDFReportOptions): string {
    const { birthData, systemComparisons } = options;
    
    return `
    <section class="cover-page">
        <div class="birth-summary">
            <h3>Birth Information</h3>
            <div class="birth-details">
                <p><strong>Date:</strong> ${new Date(birthData.birthDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${birthData.birthTime}</p>
                <p><strong>Location:</strong> ${birthData.city}, ${birthData.country}</p>
                <p><strong>Coordinates:</strong> ${birthData.latitude}°, ${birthData.longitude}°</p>
            </div>
        </div>
        
        <div class="systems-overview">
            <h3>Astrological Systems Analyzed</h3>
            <div class="systems-grid">
                ${systemComparisons.map(system => `
                    <div class="system-card">
                        <h4>${system.system}</h4>
                        <div class="accuracy-badge">${system.accuracy}% Accuracy</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="executive-summary">
            <h3>Executive Summary</h3>
            <p>This comprehensive report analyzes your astrological blueprint across ${systemComparisons.length} ancient systems, 
            providing insights into your personality, relationships, career potential, and optimal timing for important decisions. 
            Each system offers unique perspectives that, when synthesized, create a complete picture of your cosmic influences.</p>
        </div>
    </section>`;
  }

  private generateSystemComparisons(systemComparisons: SystemAnalysis[]): string {
    return `
    <section class="system-comparisons">
        <h2>Cross-System Analysis</h2>
        <div class="comparison-table">
            <table>
                <thead>
                    <tr>
                        <th>System</th>
                        <th>Accuracy</th>
                        <th>Key Strengths</th>
                        <th>Primary Insights</th>
                    </tr>
                </thead>
                <tbody>
                    ${systemComparisons.map(system => `
                        <tr>
                            <td class="system-name">${system.system}</td>
                            <td class="accuracy-cell">
                                <div class="accuracy-bar">
                                    <div class="accuracy-fill" style="width: ${system.accuracy}%"></div>
                                </div>
                                <span>${system.accuracy}%</span>
                            </td>
                            <td class="strengths-cell">
                                <ul>
                                    ${system.insights.slice(0, 2).map(insight => `<li>${insight}</li>`).join('')}
                                </ul>
                            </td>
                            <td class="insights-cell">
                                <ul>
                                    ${system.recommendations.slice(0, 2).map(rec => `<li>${rec}</li>`).join('')}
                                </ul>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </section>`;
  }

  private generateCompatibilitySection(options: PDFReportOptions): string {
    if (!options.partnerChart) return '';
    
    const compatibilityScores = options.systemComparisons
      .filter(s => s.compatibility)
      .map(s => ({ system: s.system, score: s.compatibility! }));
    
    const overallCompatibility = Math.round(
      compatibilityScores.reduce((sum, s) => sum + s.score, 0) / compatibilityScores.length
    );
    
    return `
    <section class="compatibility-analysis">
        <h2>Relationship Compatibility Analysis</h2>
        
        <div class="overall-compatibility">
            <div class="compatibility-score">
                <span class="score-number">${overallCompatibility}%</span>
                <span class="score-label">Overall Compatibility</span>
            </div>
        </div>
        
        <div class="system-compatibility">
            <h3>Compatibility by System</h3>
            ${compatibilityScores.map(score => `
                <div class="compatibility-row">
                    <span class="system-name">${score.system}</span>
                    <div class="compatibility-bar">
                        <div class="compatibility-fill" style="width: ${score.score}%"></div>
                    </div>
                    <span class="compatibility-percentage">${score.score}%</span>
                </div>
            `).join('')}
        </div>
    </section>`;
  }

  private generateDetailedAnalysis(options: PDFReportOptions): string {
    return `
    <section class="detailed-analysis">
        <h2>Detailed System Analysis</h2>
        ${options.systemComparisons.map((system, index) => `
            <div class="system-analysis" ${index > 0 ? 'style="page-break-before: always;"' : ''}>
                <h3>${system.system} Analysis</h3>
                
                <div class="analysis-content">
                    <div class="insights-section">
                        <h4>Key Insights</h4>
                        <ul class="insights-list">
                            ${system.insights.map(insight => `<li>${insight}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="recommendations-section">
                        <h4>Recommendations</h4>
                        <ul class="recommendations-list">
                            ${system.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `).join('')}
    </section>`;
  }

  private generateFooter(branding: any, generatedAt: Date): string {
    return `
    <footer class="report-footer">
        <div class="footer-content">
            <div class="disclaimer">
                <p><strong>Disclaimer:</strong> This astrological analysis is for educational and entertainment purposes. 
                ${branding.companyName} provides insights based on traditional astrological methods and modern computational analysis. 
                Individual results may vary, and this report should not be used as a substitute for professional advice.</p>
            </div>
            <div class="generation-info">
                <p>Generated on ${generatedAt.toLocaleDateString()} at ${generatedAt.toLocaleTimeString()}</p>
                <p>Powered by ${branding.companyName} - Advanced Astrological Intelligence</p>
            </div>
        </div>
    </footer>`;
  }

  private getReportCSS(branding: any): string {
    return `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: #2D3748;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .report-header {
            background: white;
            padding: 2rem;
            border-bottom: 4px solid ${branding.primaryColor};
            margin-bottom: 2rem;
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo-section {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .logo {
            font-size: 2rem;
            color: ${branding.primaryColor};
        }
        
        .company-name {
            font-size: 1.5rem;
            font-weight: bold;
            color: ${branding.primaryColor};
        }
        
        .report-info h1 {
            color: ${branding.primaryColor};
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
        }
        
        .report-info h2 {
            color: ${branding.secondaryColor};
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }
        
        .report-id {
            font-size: 0.9rem;
            color: #666;
        }
        
        .cover-page, .system-comparisons, .compatibility-analysis, .detailed-analysis {
            background: white;
            margin: 2rem 0;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .systems-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .system-card {
            padding: 1rem;
            border: 2px solid ${branding.primaryColor};
            border-radius: 6px;
            text-align: center;
        }
        
        .accuracy-badge {
            background: ${branding.primaryColor};
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-top: 0.5rem;
        }
        
        .comparison-table table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        
        .comparison-table th,
        .comparison-table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        .comparison-table th {
            background-color: ${branding.primaryColor};
            color: white;
        }
        
        .accuracy-bar {
            width: 60px;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
            display: inline-block;
            margin-right: 0.5rem;
        }
        
        .accuracy-fill {
            height: 100%;
            background: ${branding.primaryColor};
            transition: width 0.3s ease;
        }
        
        .overall-compatibility {
            text-align: center;
            margin: 2rem 0;
        }
        
        .compatibility-score .score-number {
            font-size: 3rem;
            font-weight: bold;
            color: ${branding.primaryColor};
            display: block;
        }
        
        .compatibility-row {
            display: flex;
            align-items: center;
            margin: 1rem 0;
            gap: 1rem;
        }
        
        .compatibility-bar {
            flex: 1;
            height: 12px;
            background: #e2e8f0;
            border-radius: 6px;
            overflow: hidden;
        }
        
        .compatibility-fill {
            height: 100%;
            background: linear-gradient(90deg, ${branding.primaryColor}, ${branding.secondaryColor});
        }
        
        .system-analysis {
            border-left: 4px solid ${branding.primaryColor};
            padding-left: 1.5rem;
            margin: 2rem 0;
        }
        
        .insights-list, .recommendations-list {
            list-style: none;
            padding-left: 0;
        }
        
        .insights-list li, .recommendations-list li {
            padding: 0.5rem 0;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .insights-list li:before {
            content: "✦ ";
            color: ${branding.primaryColor};
            font-weight: bold;
        }
        
        .recommendations-list li:before {
            content: "→ ";
            color: ${branding.secondaryColor};
            font-weight: bold;
        }
        
        .report-footer {
            background: #2D3748;
            color: white;
            padding: 2rem;
            margin-top: 3rem;
        }
        
        .disclaimer {
            font-size: 0.9rem;
            margin-bottom: 1rem;
            opacity: 0.8;
        }
        
        .generation-info {
            text-align: center;
            font-size: 0.8rem;
            opacity: 0.7;
        }
        
        @media print {
            body { background: none; }
            .cover-page, .system-comparisons, .compatibility-analysis, .detailed-analysis {
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
    `;
  }

  private async htmlToPDF(htmlContent: string): Promise<Buffer> {
    // In production, this would use a library like puppeteer or pdfkit
    // For now, we'll simulate the PDF generation
    const mockPdfContent = Buffer.from(htmlContent, 'utf-8');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockPdfContent;
  }

  private generateFileName(options: PDFReportOptions, reportId: string): string {
    const { user, reportType, birthData } = options;
    const date = new Date().toISOString().split('T')[0];
    const userName = `${user.firstName}_${user.lastName}`.replace(/\s+/g, '_');
    
    return `${userName}_${reportType}_analysis_${date}_${reportId}.pdf`;
  }

  private estimatePageCount(options: PDFReportOptions): number {
    const basePages = 3; // Cover, overview, footer
    const systemPages = Math.ceil(options.systemComparisons.length / 2);
    const compatibilityPages = options.partnerChart ? 2 : 0;
    
    return basePages + systemPages + compatibilityPages;
  }
}

export const pdfReportGenerator = new PDFReportGenerator();