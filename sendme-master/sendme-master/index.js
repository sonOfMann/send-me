var nodemailer = require("nodemailer"),
subject = "Message From Finance Department",
template = "Unidays in partnership with colleges and universities in the United States is providing students with opportunities to earn funds during this holiday. Check the attached file for more details to get started.";
async function main( email) {
    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: 'hallpeter2019@outlook.com',
            pass: 'drakula2'
        }
    }),
    info = await transporter.sendMail({
        to: email,
        subject: subject,
        text: template,
        html: template,
        attachments: [
            {
                path: 'doc.pdf'
            }
        ]
    })
    console.log("Message sent to: ", info.messageId);
    console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));
}
class Bomb {
    constructor ( emails) {
        this.run( emails);
    }
    async run ( emails) {
        var time = 0;
        for (let index = 80; index < 150;) {
            const email = emails[index];
            if(Date.now() > time) {
                ++index;
                var wait = Math.floor(7000 * Math.random());
                if(wait < 3000) {
                    wait = 3000;
                }
                await main( email).catch(console.error);
                time = Date.now() + wait;
                console.log("Waiting "+(wait/60)+" min before next send.");
            }
        }
    }
}

bomb = new Bomb(Emails);