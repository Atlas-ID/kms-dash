'use client';

import { useState, useEffect } from 'react';
import {
    Page,
    Layout,
    LegacyCard,
    Toast,
    Banner,
    FormLayout,
    TextField,
    Button,
    BlockStack,
    InlineStack,
    Text,
    Badge,
    Link,
    Box
} from '@shopify/polaris';
import {
    AppsIcon,
    LinkIcon,
    ExternalIcon,
    CheckCircleIcon
} from '@shopify/polaris-icons';
import { apiClient } from '@/lib/api-client';

export default function IntegrationsPage() {
    // GitHub State
    const [githubToken, setGithubToken] = useState('');
    const [githubConnected, setGithubConnected] = useState(false);
    const [githubLoading, setGithubLoading] = useState(false);
    const [githubError, setGithubError] = useState('');
    const [githubRepoCount, setGithubRepoCount] = useState(0);

    // GitLab State
    const [gitlabUrl, setGitlabUrl] = useState('');
    const [gitlabToken, setGitlabToken] = useState('');
    const [gitlabConnected, setGitlabConnected] = useState(false);
    const [gitlabLoading, setGitlabLoading] = useState(false);
    const [gitlabError, setGitlabError] = useState('');
    const [gitlabProjectCount, setGitlabProjectCount] = useState(0);

    // NPM State
    const [npmUsername, setNpmUsername] = useState('');
    const [npmConnected, setNpmConnected] = useState(false);
    const [npmLoading, setNpmLoading] = useState(false);
    const [npmError, setNpmError] = useState('');
    const [npmPackageCount, setNpmPackageCount] = useState(0);

    // Toast
    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        async function loadIntegrations() {
            try {
                const github = await apiClient.getIntegration('github').catch(() => null);
                if (github) {
                    setGithubConnected(true);
                    setGithubToken('••••••••••••••••');
                    apiClient.getExternalGithubRepos().then(repos => setGithubRepoCount(repos.length));
                }

                const gitlab = await apiClient.getIntegration('gitlab').catch(() => null);
                if (gitlab) {
                    setGitlabConnected(true);
                    setGitlabToken('••••••••••••••••');
                    setGitlabUrl(gitlab.url || '');
                    apiClient.getExternalGitlabProjects().then(projects => setGitlabProjectCount(projects.length));
                }

                const npm = await apiClient.getIntegration('npm').catch(() => null);
                if (npm) {
                    setNpmConnected(true);
                    setNpmUsername(npm.username || '');
                    apiClient.getExternalNpmPackages().then(packages => setNpmPackageCount(packages.length));
                }
            } catch (error) {
                console.error("Error loading integrations", error);
            }
        }
        loadIntegrations();
    }, []);

    const showToast = (message: string) => {
        setToastMessage(message);
        setToastActive(true);
    };

    const handleGithubConnect = async () => {
        setGithubLoading(true);
        setGithubError('');
        try {
            await apiClient.saveIntegration('github', { token: githubToken });
            const repos = await apiClient.getExternalGithubRepos();
            setGithubRepoCount(repos.length);
            setGithubConnected(true);
            setGithubToken('••••••••••••••••');
            showToast('GitHub connected successfully!');
        } catch (error: any) {
            setGithubError(error.message || 'Failed to connect. Check your token.');
            await apiClient.deleteIntegration('github').catch(() => { });
        } finally {
            setGithubLoading(false);
        }
    };

    const handleGithubDisconnect = async () => {
        await apiClient.deleteIntegration('github');
        setGithubConnected(false);
        setGithubToken('');
        setGithubRepoCount(0);
        showToast('GitHub disconnected');
    };

    const handleGitlabConnect = async () => {
        setGitlabLoading(true);
        setGitlabError('');
        try {
            await apiClient.saveIntegration('gitlab', { url: gitlabUrl, token: gitlabToken });
            const projects = await apiClient.getExternalGitlabProjects();
            setGitlabProjectCount(projects.length);
            setGitlabConnected(true);
            setGitlabToken('••••••••••••••••');
            showToast('GitLab connected successfully!');
        } catch (error: any) {
            setGitlabError(error.message || 'Failed to connect. Check URL and token.');
            await apiClient.deleteIntegration('gitlab').catch(() => { });
        } finally {
            setGitlabLoading(false);
        }
    };

    const handleGitlabDisconnect = async () => {
        await apiClient.deleteIntegration('gitlab');
        setGitlabConnected(false);
        setGitlabToken('');
        setGitlabUrl('');
        setGitlabProjectCount(0);
        showToast('GitLab disconnected');
    };

    const handleNpmConnect = async () => {
        setNpmLoading(true);
        setNpmError('');
        try {
            await apiClient.saveIntegration('npm', { username: npmUsername });
            const packages = await apiClient.getExternalNpmPackages();
            setNpmPackageCount(packages.length);
            setNpmConnected(true);
            showToast('NPM connected successfully!');
        } catch (error: any) {
            setNpmError('NPM user not found');
            await apiClient.deleteIntegration('npm').catch(() => { });
        } finally {
            setNpmLoading(false);
        }
    };

    const handleNpmDisconnect = async () => {
        await apiClient.deleteIntegration('npm');
        setNpmConnected(false);
        setNpmUsername('');
        setNpmPackageCount(0);
        showToast('NPM disconnected');
    };

    return (
        <Page
            title="Integrations"
            subtitle="Connect your accounts to import projects automatically"
        >
            <Layout>
                <Layout.Section>
                    <Banner icon={AppsIcon} tone="info">
                        <p>{[githubConnected, gitlabConnected, npmConnected].filter(Boolean).length} of 3 services connected.</p>
                    </Banner>
                </Layout.Section>

                <Layout.Section variant="oneThird">
                    <LegacyCard title="GitHub" sectioned>
                        <BlockStack gap="400">
                            <Text as="p" tone="subdued">Import repositories from GitHub.com</Text>
                            {githubConnected ? (
                                <BlockStack gap="200">
                                    <Badge tone="success" icon={CheckCircleIcon}>Connected</Badge>
                                    <Text as="p">{githubRepoCount} repositories found</Text>
                                    <Button onClick={handleGithubDisconnect} tone="critical" variant="secondary">Disconnect</Button>
                                </BlockStack>
                            ) : (
                                <FormLayout>
                                    <TextField
                                        label="Personal Access Token"
                                        type="password"
                                        value={githubToken}
                                        onChange={setGithubToken}
                                        autoComplete="off"
                                        helpText={<Link url="https://github.com/settings/tokens" external>Setup in GitHub Settings</Link>}
                                    />
                                    {githubError && <Text as="p" tone="critical">{githubError}</Text>}
                                    <Button onClick={handleGithubConnect} loading={githubLoading} variant="primary" disabled={!githubToken}>Connect GitHub</Button>
                                </FormLayout>
                            )}
                        </BlockStack>
                    </LegacyCard>
                </Layout.Section>

                <Layout.Section variant="oneThird">
                    <LegacyCard title="GitLab" sectioned>
                        <BlockStack gap="400">
                            <Text as="p" tone="subdued">Connect your self-hosted GitLab instance</Text>
                            {gitlabConnected ? (
                                <BlockStack gap="200">
                                    <Badge tone="success" icon={CheckCircleIcon}>Connected</Badge>
                                    <Text as="p">{gitlabProjectCount} projects found</Text>
                                    <Button onClick={handleGitlabDisconnect} tone="critical" variant="secondary">Disconnect</Button>
                                </BlockStack>
                            ) : (
                                <FormLayout>
                                    <TextField
                                        label="Instance URL"
                                        value={gitlabUrl}
                                        onChange={setGitlabUrl}
                                        placeholder="https://gitlab.example.com"
                                        autoComplete="off"
                                    />
                                    <TextField
                                        label="Personal Access Token"
                                        type="password"
                                        value={gitlabToken}
                                        onChange={setGitlabToken}
                                        autoComplete="off"
                                    />
                                    {gitlabError && <Text as="p" tone="critical">{gitlabError}</Text>}
                                    <Button onClick={handleGitlabConnect} loading={gitlabLoading} variant="primary" disabled={!gitlabToken || !gitlabUrl}>Connect GitLab</Button>
                                </FormLayout>
                            )}
                        </BlockStack>
                    </LegacyCard>
                </Layout.Section>

                <Layout.Section variant="oneThird">
                    <LegacyCard title="NPM" sectioned>
                        <BlockStack gap="400">
                            <Text as="p" tone="subdued">Import packages from npmjs.com</Text>
                            {npmConnected ? (
                                <BlockStack gap="200">
                                    <Badge tone="success" icon={CheckCircleIcon}>Connected</Badge>
                                    <Text as="p">{npmPackageCount} packages found</Text>
                                    <Button onClick={handleNpmDisconnect} tone="critical" variant="secondary">Disconnect</Button>
                                </BlockStack>
                            ) : (
                                <FormLayout>
                                    <TextField
                                        label="NPM Username"
                                        value={npmUsername}
                                        onChange={setNpmUsername}
                                        prefix="@"
                                        autoComplete="off"
                                    />
                                    {npmError && <Text as="p" tone="critical">{npmError}</Text>}
                                    <Button onClick={handleNpmConnect} loading={npmLoading} variant="primary" disabled={!npmUsername}>Connect NPM</Button>
                                </FormLayout>
                            )}
                        </BlockStack>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
            {toastActive && <Toast content={toastMessage} onDismiss={() => setToastActive(false)} />}
        </Page>
    );
}
