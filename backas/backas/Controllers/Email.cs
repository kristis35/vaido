using System;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace backas.Controllers
{
    public interface IEmailService
    {
        void SendEmail(string toEmail, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void SendEmail(string toEmail, string subject, string body)
        {
            var fromEmail = _configuration["EmailSettings:FromEmail"];
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]);
            var smtpUser = _configuration["EmailSettings:SmtpUser"];
            var smtpPass = _configuration["EmailSettings:SmtpPass"];

            var mail = new MailMessage
            {
                From = new MailAddress(fromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };
            mail.To.Add(toEmail);

            var smtpClient = new SmtpClient(smtpServer, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true,  // Ensure SSL is enabled for secure communication
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Timeout = 20000  // Optional: Set a timeout for the SMTP client
            };

            smtpClient.Send(mail);
        }
    }
}
