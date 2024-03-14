import { JenkinsApiResponse, JenkinsBuildDetails } from '@/app/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<JenkinsApiResponse>) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const jobName = req.query.jobName as string;
    if (!jobName) {
        return res.status(400).json({ error: 'Job name is required as a query parameter.' });
    }

    const jenkinsUrl = process.env.JENKINS_URL;
    const jenkinsToken = process.env.JENKINS_TOKEN;
    const jenkinsUser = process.env.JENKINS_USER;

    if (!jenkinsUrl || !jenkinsToken || !jenkinsUser) {
        return res.status(500).json({ error: 'Jenkins credentials are not properly configured.' });
    }

    const auth = Buffer.from(`${jenkinsUser}:${jenkinsToken}`).toString('base64');
    const apiUrl = `${jenkinsUrl}/job/${jobName}/lastBuild/api/json`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Jenkins API responded with status ${response.status}`);
        }

        const data: JenkinsBuildDetails = await response.json();
        res.status(200).json({ latestBuild: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data from Jenkins.' });
    }
}
