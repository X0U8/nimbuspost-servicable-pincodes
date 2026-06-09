import fs from 'fs';
import path from 'path';

const MY_APP_ID_SECRETS = 'MY_SECRET_APP_ID_GOES_HERE';

export default function handler(req, res) {
  const appIdHeader = req.headers['x-app-id'];
  
  if (!appIdHeader || appIdHeader !== MY_APP_ID_SECRETS) {
    return res.status(200).json(".");
  }

  const { pincode } = req.query;
  
  if (!pincode) {
    return res.status(400).json({ error: 'Missing pincode' });
  }

  try {
    const filePath = path.join(process.cwd(), 'index.html');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const regex = new RegExp(`{[^}]*"pincode"\\s*:\\s*"${pincode}"[^}]*}`, 'g');
    const matches = fileContent.match(regex) || [];

    const result = matches.map(line => {
      try {
        return JSON.parse(line.replace(/,$/, ''));
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Server error, Vrcl fckd' });
  }
}
