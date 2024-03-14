import type { NextApiRequest, NextApiResponse } from 'next';
import { PRDetails, GitHubReview, GitHubPR } from '../../../app/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse<PRDetails[] | { message: string }>) {
    const { repo } = req.query;
    const githubToken = process.env.GITHUB_TOKEN; 

    if (!repo || typeof repo !== 'string') {
        return res.status(400).json({ message: 'Owner and repo query parameters are required' });
    }

    let userName: string | undefined;
    try {
        const userResponse = await fetch(`https://api.github.com/user`, {
            headers: {
                Authorization: `token ${githubToken}`,
                'User-Agent': 'request',
            },
        });
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user');
        }
        const user = await userResponse.json();
        userName = user.login;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

    try {
        const prsResponse = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
            headers: {
                Authorization: `token ${githubToken}`,
                'User-Agent': 'request',
            },
        });

        if (!prsResponse.ok) {
            throw new Error(`GitHub API responded with status ${prsResponse.status}`);
        }

        const prs: GitHubPR[] = await prsResponse.json();

        const prDetails = await Promise.all(
            prs.map(async (pr) => {
                const reviewUrl = `https://api.github.com/repos/${repo}/pulls/${pr.number}/reviews`;
                const reviewsResponse = await fetch(reviewUrl, {
                    headers: {
                        Authorization: `token ${githubToken}`,
                        'User-Agent': 'request',
                    },
                });

                if (!reviewsResponse.ok) {
                    throw new Error('Failed to fetch reviews');
                }
                const reviews: GitHubReview[] = await reviewsResponse.json();

                const approvals = reviews.filter((review) => review.state === 'APPROVED').length;
                const userApproval = reviews.some(
                    (review) => review.user.login === userName && review.state === 'APPROVED',
                );

                return {
                    id: pr.id,
                    title: pr.title,
                    htmlUrl: pr.html_url,
                    user: pr.user,
                    approvals,
                    userApproval,
                    createdAt: pr.created_at,
                };
            }),
        );

        res.status(200).json(prDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
