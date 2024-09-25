using MailKit.Net.Smtp;
using MimeKit;
using System;

public interface IEmailService
{
    void SendEmail(string toEmail, string subject, string body);
}

public class EmailService : IEmailService
{
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUser;
    private readonly string _smtpPass;
    private readonly string _fromEmail;

    public EmailService()
    {
        // Using the provided settings
        _smtpServer = "smtp.hostinger.com";
        _smtpPort = 465;
        _smtpUser = "info@prixora.lt";
        _smtpPass = "Pardavimas123+";
        _fromEmail = "info@prixora.lt";
    }

    public void SendEmail(string toEmail, string subject, string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Prixora", _fromEmail));
        message.To.Add(new MailboxAddress("Recipient", toEmail));
        message.Subject = subject;
        message.Body = new TextPart("plain")
        {
            Text = body
        };

        using (var client = new SmtpClient())
        {
            try
            {
                client.Connect(_smtpServer, _smtpPort, true); // Use SSL

                // Authenticate with the SMTP server
                client.Authenticate(_smtpUser, _smtpPass);

                // Send the email
                client.Send(message);
                client.Disconnect(true);
            }
            catch (Exception ex)
            {
                // Log the detailed exception message
                throw new Exception($"Failed to send email via SMTP: {ex.Message}", ex);
            }
        }
    }
}
