/* eslint-disable max-len */
const mailjet = require('node-mailjet')
  .connect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET);
const { User } = require('../../../../database');

const sendEmail = async (instance) => {
  if (process.env.FAKE_MAIL === 'FAKE') {
    console.log('FAKE MAIL SENDED');
    return;
  }

  const u = await User.findById(instance.userId);

  const params = instance.reaction.params.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {});

  await mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: 'dash@alexandresauner.fr',
            Name: 'Area',
          },
          To: [
            {
              Email: u.email,
              Name: u.username,
            },
          ],
          Subject: params.subjects,
          TextPart: params.body,
          CustomID: 'AreaReactionEmail',
        },
      ],
    });
};

module.exports = sendEmail;
