import { User } from "@shared/schema";

interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

interface EmailOptions {
  to: string;
  template: EmailTemplate;
  attachments?: EmailAttachment[];
  scheduledFor?: Date;
  personalData?: {
    firstName: string;
    reportType: string;
    systemsAnalyzed: string[];
  };
}

export class EmailService {
  async sendReport(options: EmailOptions): Promise<{
    success: boolean;
    messageId: string;
    scheduledAt?: Date;
    error?: string;
  }> {
    try {
      // In production, this would integrate with services like:
      // - SendGrid, Mailgun, AWS SES, or similar
      // For now, we'll simulate the email sending process
      
      const messageId = this.generateMessageId();
      
      if (options.scheduledFor && options.scheduledFor > new Date()) {
        // Schedule email for future delivery
        return {
          success: true,
          messageId,
          scheduledAt: options.scheduledFor
        };
      }
      
      // Simulate email sending delay
      await this.simulateEmailSending();
      
      return {
        success: true,
        messageId
      };
      
    } catch (error) {
      return {
        success: false,
        messageId: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  generatePersonalizedTemplate(user: User, reportType: string, systemsAnalyzed: string[]): EmailTemplate {
    const firstName = user.firstName || 'Friend';
    const reportTitle = this.getReportTitle(reportType);
    
    const subject = `${firstName}, your ${reportTitle} is ready ✨`;
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Astrological Analysis from MyTorchlight</title>
    <style>
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: #2D3748;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #F59E0B 0%, #8B5CF6 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .logo {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        .header h1 {
            margin: 0;
            font-size: 1.8rem;
            font-weight: 300;
        }
        .content {
            padding: 2rem;
        }
        .greeting {
            font-size: 1.2rem;
            color: #4A5568;
            margin-bottom: 1.5rem;
        }
        .report-summary {
            background: #F7FAFC;
            padding: 1.5rem;
            border-radius: 8px;
            margin: 1.5rem 0;
            border-left: 4px solid #F59E0B;
        }
        .systems-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 0.5rem;
            margin: 1rem 0;
        }
        .system-badge {
            background: #EDF2F7;
            color: #4A5568;
            padding: 0.5rem;
            border-radius: 6px;
            text-align: center;
            font-size: 0.9rem;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #F59E0B 0%, #8B5CF6 100%);
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 1.5rem 0;
            text-align: center;
            transition: transform 0.2s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .insights-preview {
            background: #EBF8FF;
            padding: 1.5rem;
            border-radius: 8px;
            margin: 1.5rem 0;
            border-left: 4px solid #3182CE;
        }
        .footer {
            background: #2D3748;
            color: #CBD5E0;
            padding: 1.5rem;
            text-align: center;
            font-size: 0.9rem;
        }
        .footer a {
            color: #F59E0B;
            text-decoration: none;
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #E2E8F0, transparent);
            margin: 2rem 0;
        }
        .social-links {
            margin: 1rem 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 0.5rem;
            color: #F59E0B;
            text-decoration: none;
        }
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            .content {
                padding: 1.5rem;
            }
            .systems-list {
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🔆</div>
            <h1>MyTorchlight</h1>
            <p>Your Cosmic Blueprint Awaits</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Dear ${firstName},
            </div>
            
            <p>Your comprehensive ${reportTitle.toLowerCase()} has been carefully prepared using our advanced astrological intelligence system. This personalized analysis combines ancient wisdom with modern precision to illuminate your unique cosmic blueprint.</p>
            
            <div class="report-summary">
                <h3 style="margin-top: 0; color: #2D3748;">📊 Your Analysis Includes:</h3>
                <div class="systems-list">
                    ${systemsAnalyzed.map(system => `
                        <div class="system-badge">${system}</div>
                    `).join('')}
                </div>
                <p style="margin-bottom: 0; font-style: italic; color: #4A5568;">
                    ${systemsAnalyzed.length} ancient systems analyzed with Swiss Ephemeris precision
                </p>
            </div>
            
            <div class="insights-preview">
                <h3 style="margin-top: 0; color: #2B6CB0;">✨ Preview of Your Insights:</h3>
                <ul style="margin: 0; padding-left: 1.2rem;">
                    <li>Personality analysis across multiple astrological traditions</li>
                    <li>Career guidance based on your cosmic blueprint</li>
                    <li>Relationship compatibility and communication insights</li>
                    <li>Optimal timing for important life decisions</li>
                    <li>Health and wellness recommendations</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="#" class="cta-button">
                    📱 View Your Complete Analysis
                </a>
            </div>
            
            <div class="divider"></div>
            
            <p style="color: #4A5568; font-style: italic;">
                <strong>What makes this special?</strong> Unlike traditional horoscopes, your analysis is calculated using your exact birth data and synthesizes insights from 7+ astrological systems - providing depth impossible to achieve with single-system approaches.
            </p>
            
            <p style="color: #4A5568;">
                Questions about your reading? Reply to this email and our cosmic guidance team will help illuminate any aspect of your analysis.
            </p>
            
            <p style="color: #4A5568;">
                May the stars guide your journey,<br>
                <strong>The MyTorchlight Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <p><strong>MyTorchlight</strong> - Illuminating Your Cosmic Path</p>
            
            <div class="social-links">
                <a href="#">🌐 Website</a>
                <a href="#">📱 Mobile App</a>
                <a href="#">📚 Learn More</a>
            </div>
            
            <p style="font-size: 0.8rem; opacity: 0.8; margin-top: 1.5rem;">
                This email was sent because you requested an astrological analysis from MyTorchlight.<br>
                For questions or support, contact us at support@mytorchlight.com
            </p>
            
            <p style="font-size: 0.7rem; opacity: 0.6; margin-top: 1rem;">
                © 2025 MyTorchlight. All rights reserved.<br>
                This analysis is for educational and entertainment purposes.
            </p>
        </div>
    </div>
</body>
</html>`;

    const textContent = `
Dear ${firstName},

Your comprehensive ${reportTitle.toLowerCase()} is ready!

Your Analysis Includes:
${systemsAnalyzed.map(system => `• ${system}`).join('\n')}

This personalized analysis combines ancient wisdom with modern precision using your exact birth data across ${systemsAnalyzed.length} astrological systems.

Preview of Your Insights:
• Personality analysis across multiple astrological traditions
• Career guidance based on your cosmic blueprint  
• Relationship compatibility and communication insights
• Optimal timing for important life decisions
• Health and wellness recommendations

View your complete analysis at: [Link to report]

What makes this special? Unlike traditional horoscopes, your analysis is calculated using Swiss Ephemeris precision and synthesizes insights from 7+ astrological systems.

Questions? Reply to this email and our team will help.

May the stars guide your journey,
The MyTorchlight Team

---
MyTorchlight - Illuminating Your Cosmic Path
© 2025 MyTorchlight. All rights reserved.
`;

    return {
      subject,
      htmlContent,
      textContent
    };
  }

  private getReportTitle(reportType: string): string {
    const titles = {
      'personal': 'Personal Astrological Analysis',
      'compatibility': 'Relationship Compatibility Analysis',
      'detailed': 'Comprehensive Life Blueprint',
      'career': 'Career Guidance Analysis',
      'health': 'Wellness & Health Insights'
    };
    
    return titles[reportType as keyof typeof titles] || 'Astrological Analysis';
  }

  private generateMessageId(): string {
    return `torch_email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async simulateEmailSending(): Promise<void> {
    // Simulate email service processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  async scheduleReport(
    user: User, 
    reportData: Buffer, 
    reportType: string, 
    systemsAnalyzed: string[],
    scheduleFor: Date
  ): Promise<{ success: boolean; scheduledId: string }> {
    const template = this.generatePersonalizedTemplate(user, reportType, systemsAnalyzed);
    
    const emailOptions: EmailOptions = {
      to: user.email!,
      template,
      attachments: [{
        filename: `${user.firstName}_${reportType}_analysis.pdf`,
        content: reportData,
        contentType: 'application/pdf'
      }],
      scheduledFor: scheduleFor,
      personalData: {
        firstName: user.firstName || 'Friend',
        reportType,
        systemsAnalyzed
      }
    };

    const result = await this.sendReport(emailOptions);
    
    return {
      success: result.success,
      scheduledId: result.messageId
    };
  }

  generateWelcomeEmail(user: User): EmailTemplate {
    const firstName = user.firstName || 'Cosmic Explorer';
    
    return {
      subject: `Welcome to MyTorchlight, ${firstName}! Your cosmic journey begins ✨`,
      htmlContent: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #F59E0B 0%, #8B5CF6 100%); color: white; padding: 2rem; text-align: center; border-radius: 12px 12px 0 0;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔆</div>
            <h1>Welcome to MyTorchlight!</h1>
            <p>Your cosmic journey starts here</p>
          </div>
          
          <div style="padding: 2rem; background: white;">
            <p>Dear ${firstName},</p>
            
            <p>Welcome to the most comprehensive astrological analysis platform! You now have access to insights from 7+ ancient systems including Western, Vedic, Chinese, Human Design, and Numerology.</p>
            
            <div style="background: #F7FAFC; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
              <h3>🌟 What You Can Explore:</h3>
              <ul>
                <li>Complete birth chart analysis across multiple traditions</li>
                <li>AI-powered cosmic guidance and daily insights</li>
                <li>Relationship compatibility analysis</li>
                <li>Optimal timing for important decisions</li>
                <li>Educational content about astrological systems</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 2rem 0;">
              <a href="#" style="background: linear-gradient(135deg, #F59E0B 0%, #8B5CF6 100%); color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; font-weight: bold;">
                🚀 Start Your Analysis
              </a>
            </div>
            
            <p>Ready to discover your cosmic blueprint? Your personalized analysis awaits!</p>
            
            <p>Stellar regards,<br><strong>The MyTorchlight Team</strong></p>
          </div>
        </div>
      `,
      textContent: `
Welcome to MyTorchlight, ${firstName}!

Your cosmic journey starts here. You now have access to comprehensive astrological analysis across 7+ ancient systems.

What You Can Explore:
• Complete birth chart analysis across multiple traditions
• AI-powered cosmic guidance and daily insights  
• Relationship compatibility analysis
• Optimal timing for important decisions
• Educational content about astrological systems

Start your analysis at: [Link]

Ready to discover your cosmic blueprint?

Stellar regards,
The MyTorchlight Team
      `
    };
  }
}

export const emailService = new EmailService();