export interface IEmail {
    to: string[];
    fromMail: string;
    fromName: string;
    replyTo: string;
    subject: string;
    content: string;
    apiKey: string;
}
