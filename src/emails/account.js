const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');  //(process.env.SEND_GRID_API_KEY);

// sgMail.send({
//     to: 'fprocacci@hotmail.com',
//     from: 'fprocacci@hotmail.com',
//     subject: 'This is my first nodejs email',
//     text: 'FIRST EMAIL'
// });

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'felixprocacci@justthefactsmedia.com',
        subject: 'Testing emails',
        text: `Welcome to the app, ${name}`
        // html: 
    });    
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'felixprocacci@justthefactsmedia.com',
        subject: 'Testing cancel emails',
        text: `Sorry to see you go, ${name}`
        
    });    
}

module.exports = {
    sendWelcomeEmail: sendWelcomeEmail,
    sendCancelEmail: sendCancelEmail  
}