export interface GitHubUser {
    login: string;
    avatar_url: string;
}

export interface GitHubReview {
    id: number;
    user: GitHubUser;
    state: 'APPROVED' | 'REQUEST_CHANGES' | 'COMMENT' | 'PENDING';
}

export interface PRDetails {
    title: string;
    approvals: number;
    userApproval: boolean;
    user: GitHubUser;
    htmlUrl: string;
    createdAt: string;
}

export interface GitHubPR {
    id: number;
    title: string;
    html_url: string;
    user: GitHubUser;
    reviews_url: string;
    created_at: string;
    number: number;
}

export interface ReposWithJobs {
    repo: string;
    jenkinsJob: string;
}

export interface JenkinsBuildDetails {
    id: string;
    fullDisplayName: string;
    result: 'SUCCESS' | 'FAILURE' | 'UNSTABLE' | 'ABORTED' | null;
    timestamp: number;
    duration: number;
    url: string;
    building: boolean;
    changeSets: {
        kind: string;
        items: {
            commitId: string;
            date: string;
            msg: string;
        }[];
    }[];
}

export interface JenkinsApiResponse {
    error?: string;
    latestBuild?: JenkinsBuildDetails;
}

export interface RepoAndJobDetails {
    jenkinsDetails: JenkinsApiResponse;
    prDetails: PRDetails[];
}
