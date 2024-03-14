'use client';
import { useEffect, useState } from 'react';
import Repo from './Repo';
import AppInputsDrawer from './AppInputsDrawer';
import { Divider, Flex, Typography, Layout } from 'antd';
import { ReposWithJobs } from '../types';

export const Repos = () => {
    const [repoList, setRepoList] = useState<ReposWithJobs[]>([]);

    useEffect(() => {
        const storedList = JSON.parse(localStorage.getItem('myList') || '[]') || [];
        setRepoList(storedList);
    }, []);

    return (
        <div style={{ width: 800 }}>
            <Flex gap="middle" style={{ height: 50 }} justify="space-between" className="w-full">
                <div className="my-auto">
                    <Typography.Title style={{ color: 'white', marginBottom: 0 }}>Repos</Typography.Title>
                </div>
                <div className="my-auto">
                    <AppInputsDrawer repoList={repoList} setRepoList={setRepoList} />
                </div>
            </Flex>
            <Divider />

            {repoList.map((listItem, index) => (
                <div key={index} className="mb-4">
                    <Repo key={index} repo={listItem} />
                </div>
            ))}
        </div>
    );
};
