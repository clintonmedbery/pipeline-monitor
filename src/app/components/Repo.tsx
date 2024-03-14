import React, { useState, useEffect } from 'react';
import { JenkinsApiResponse, PRDetails, RepoAndJobDetails, ReposWithJobs } from '../types';
import { Avatar, Badge, Card, Divider, Flex, List, Skeleton, Typography } from 'antd';
import { JenkinsInfo } from './JenkinsInfo';
const { Text, Link } = Typography;

function Repo({ repo: repoWithJob }: { repo: ReposWithJobs }) {
    const [details, setDetails] = useState<RepoAndJobDetails>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const prsUrl = `/api/prs?repo=${encodeURIComponent(repoWithJob.repo)}`;
            const jenkinsUrl = `/api/jenkins?jobName=${encodeURIComponent(repoWithJob.jenkinsJob)}`;

            try {
                const [prsResponse, jenkinsResponse] = await Promise.all([fetch(prsUrl), fetch(jenkinsUrl)]);

                if (!prsResponse.ok) {
                    throw new Error(`PR API responded with status ${prsResponse.status}`);
                }

                const prDetails = (await prsResponse.json()) as PRDetails[];
                const jenkinsDetails = (await jenkinsResponse.json()) as JenkinsApiResponse;

                setDetails({ prDetails, jenkinsDetails });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [repoWithJob]);

    const content = loading ? (
        <Skeleton />
    ) : (
        <>
            {details ? (
                <>
                    <JenkinsInfo jenkinsDetails={details.jenkinsDetails} />
                    <Divider />
                    <List
                        itemLayout="horizontal"
                        dataSource={details.prDetails}
                        renderItem={(detail, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={detail.user.avatar_url} />}
                                    title={
                                        <Flex justify="space-between">
                                            <Link style={{ color: '#1677ff' }} target="_blank" href={detail.htmlUrl}>
                                                {detail.title}
                                            </Link>
                                            <Text type="secondary">{new Date(detail.createdAt).toLocaleString()}</Text>
                                        </Flex>
                                    }
                                    description={`Approvals: ${detail.approvals}, Your Approval: ${
                                        detail.userApproval ? 'Yes' : 'No'
                                    }`}
                                />
                            </List.Item>
                        )}
                    />
                </>
            ) : (
                <p>No details available</p>
            )}
        </>
    );

    return (
        <Card
            title={`Pull Requests for ${repoWithJob.repo}`}
            extra={
                <Link target="_blank" href={`https://www.github.com/${repoWithJob.repo}`}>
                    Open Repo
                </Link>
            }
            style={{ width: 800 }}
        >
            {content}
        </Card>
    );
}

export default Repo;
