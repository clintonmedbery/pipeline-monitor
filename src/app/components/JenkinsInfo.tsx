import { Flex, Badge, Typography } from 'antd';
import { JenkinsApiResponse } from '../types';
const { Text, Link } = Typography;

export const JenkinsInfo = ({ jenkinsDetails }: { jenkinsDetails: JenkinsApiResponse }) => {
    if (jenkinsDetails.error) {
        return <div>Error grabbing Jenkins detail: {jenkinsDetails.error}</div>;
    }

    const getStatus = () => {
        if (!jenkinsDetails.latestBuild) {
            return 'No builds yet';
        }
        if (jenkinsDetails.latestBuild.building) {
            return <Status text="Building/Paused" status="processing" />;
        }

        if (jenkinsDetails.latestBuild.result === 'SUCCESS') {
            return <Status text="Success" status="success" />;
        }

        if (jenkinsDetails.latestBuild.result === 'FAILURE') {
            return <Status text="Failed" status="error" />;
        }
        return jenkinsDetails.latestBuild.result || 'Building';
    };
    const getLastChangeset = () => {
        if (!jenkinsDetails.latestBuild) {
            return 'No builds yet';
        }
        const changeset = jenkinsDetails.latestBuild.changeSets[0];
        if (!changeset) {
            return 'No changeset';
        }
        return changeset.items[0].msg;
    };
    return (
        <>
            <Flex justify="space-between">
                <Flex vertical>
                    <Text strong>Jenkins Build Status</Text>
                    <Link target="_blank" href={jenkinsDetails.latestBuild?.url}>
                        {jenkinsDetails.latestBuild?.fullDisplayName}
                    </Link>
                    {getLastChangeset()}
                </Flex>

                <Flex vertical>
                    <div className="my-auto">{getStatus()}</div>
                </Flex>
            </Flex>
        </>
    );
};

const Status = ({ text, status }: { text: string; status: 'success' | 'error' | 'processing' }) => {
    return (
        <Flex>
            <div style={{ marginRight: '1em' }}>{text}</div>
            <Badge dot style={{ scale: 3.5 }} title="Status" status={status} size="default" />
        </Flex>
    );
};
