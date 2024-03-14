import React, { useState, useEffect } from 'react';
import { Button, Drawer, List, Input, Space, Flex } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ReposWithJobs } from '../types';

const AppInputsDrawer = ({
    repoList,
    setRepoList,
}: {
    repoList: ReposWithJobs[];
    setRepoList: (list: ReposWithJobs[]) => void;
}) => {
    const [visible, setVisible] = useState(false);
    const [newRepo, setNewRepo] = useState('');
    const [newJenkinsJob, setNewJenkinsJob] = useState('');

    const addToList = () => {
        const newList = [...repoList, { repo: newRepo, jenkinsJob: newJenkinsJob }];
        setRepoList(newList);
        setNewRepo('');
        setNewJenkinsJob('');
        localStorage.setItem('myList', JSON.stringify(newList));
    };

    const deleteFromList = (index: number) => {
        const newList = repoList.filter((_, i) => i !== index);
        setRepoList(newList);
        localStorage.setItem('myList', JSON.stringify(newList));
    };

    return (
        <>
            <Button type="primary" onClick={() => setVisible(true)}>
                Manage Repos
            </Button>
            <Drawer title="Manage Repos" placement="right" onClose={() => setVisible(false)} open={visible}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Input
                        placeholder="Repo Name <org>/<repoName>"
                        value={newRepo}
                        onChange={(e) => setNewRepo(e.target.value)}
                    />
                    <Input
                        placeholder="Jenkins Job Name <folder>/job/<jobName>"
                        value={newJenkinsJob}
                        onChange={(e) => setNewJenkinsJob(e.target.value)}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={addToList}>
                        Add
                    </Button>
                </Space>
                <List
                    dataSource={repoList}
                    renderItem={(item, index) => (
                        <List.Item actions={[<DeleteOutlined key="delete" onClick={() => deleteFromList(index)} />]}>
                            <Flex vertical>
                                <div>Repo: {item.repo}</div>
                                <div>Jenkins Job: {item.jenkinsJob}</div>
                            </Flex>
                        </List.Item>
                    )}
                />
            </Drawer>
        </>
    );
};

export default AppInputsDrawer;
