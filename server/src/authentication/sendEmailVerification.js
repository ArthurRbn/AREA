const mailjet = require('node-mailjet')
  .connect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET);

const sendEmailVerification = async (u) => {
  if (process.env.FAKE_MAIL === 'FAKE') {
    console.log(`${process.env.FRONTEND_URL}/validate/${u.emailToken}`);
    return;
  }
  await mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: 'dash@alexandresauner.fr',
            Name: 'Dashboard',
          },
          To: [
            {
              Email: u.email,
              Name: u.username,
            },
          ],
          Subject: 'Greetings from Dashboard.',
          TextPart: `Please validate your email. ${process.env.FRONTEND_URL}/validate/${u.emailToken}`,
          HTMLPart: `<h3>Dear ${u.username}, please validate your email: <a href='${process.env.FRONTEND_URL}/validate/${u.emailToken}'>${process.env.FRONTEND_URL}/validate/${u.emailToken}</a>!</h3><br />May the force be with you!`,
          CustomID: 'DashboardEmailValidation',
        },
      ],
    });
};

module.exports = sendEmailVerification;
