'use client';

import { useState, useCallback, useEffect } from 'react';
import {
    Modal,
    TextField,
    FormLayout,
    Checkbox,
    Banner,
    Select,
    Spinner,
    Text,
    InlineStack,
    Box,
    BlockStack,
    Button
} from '@shopify/polaris';
import { ClipboardIcon, CheckCircleIcon } from '@shopify/polaris-icons';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { apiClient } from '@/lib/api-client';

interface PolarisCreateApiKeyModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: (data: any) => void;
}

const availableScopes = ['read', 'write', 'delete', 'admin'];

export function PolarisCreateApiKeyModal({ open, onClose, onCreate }: PolarisCreateApiKeyModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);

    const [kmsProjects, setKmsProjects] = useState<any[]>([]);
    const [githubRepos, setGithubRepos] = useState<any[]>([]);
    const [gitlabProjects, setGitlabProjects] = useState<any[]>([]);
    const [npmPackages, setNpmPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [projectSource, setProjectSource] = useState<'kms' | 'github' | 'gitlab' | 'npm'>('kms');
    const [selectedProject, setSelectedProject] = useState('');
    const [environment, setEnvironment] = useState('development');

    const { isCopied, copyToClipboard } = useCopyToClipboard();

    useEffect(() => {
        if (open) {
            setLoading(true);
            Promise.all([
                apiClient.getProjects(),
                apiClient.getExternalGithubRepos().catch(() => []),
                apiClient.getExternalGitlabProjects().catch(() => []),
                apiClient.getExternalNpmPackages().catch(() => [])
            ]).then(([kms, github, gitlab, npm]) => {
                setKmsProjects(kms);
                setGithubRepos(github);
                setGitlabProjects(gitlab);
                setNpmPackages(npm);

                if (kms.length > 0) {
                    setProjectSource('kms');
                    setSelectedProject(kms[0].id);
                } else if (github.length > 0) {
                    setProjectSource('github');
                    setSelectedProject(github[0].full_name || github[0].name);
                }
                setLoading(false);
            }).catch(err => {
                console.error("Error loading projects:", err);
                setLoading(false);
            });
        }
    }, [open]);

    const handleScopeChange = useCallback((newChecked: boolean, newScope: string) => {
        setSelectedScopes((prev) => {
            if (newChecked) return [...prev, newScope];
            return prev.filter(s => s !== newScope);
        });
    }, []);

    const handleCreate = () => {
        const data = {
            name,
            description,
            scopes: selectedScopes,
            projectId: selectedProject,
            environment
        };
        onCreate(data);
    };

    const handleClose = useCallback(() => {
        setGeneratedKey(null);
        setName('');
        setDescription('');
        setSelectedScopes([]);
        onClose();
    }, [onClose]);

    if (generatedKey) {
        return (
            <Modal
                open={open}
                onClose={handleClose}
                title="API Key Generated"
                primaryAction={{
                    content: 'Done',
                    onAction: handleClose,
                }}
            >
                <Modal.Section>
                    <BlockStack gap="400">
                        <Banner tone="warning">
                            This is the only time you will see this key. Please save it securely.
                        </Banner>
                        <TextField
                            label="Your New API Key"
                            value={generatedKey}
                            autoComplete="off"
                            readOnly
                            monospaced
                            connectedRight={
                                <Button
                                    icon={isCopied ? CheckCircleIcon : ClipboardIcon}
                                    onClick={() => copyToClipboard(generatedKey)}
                                    variant="primary"
                                >
                                    {isCopied ? 'Copied' : 'Copy'}
                                </Button>
                            }
                        />
                    </BlockStack>
                </Modal.Section>
            </Modal>
        )
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Create New API Key"
            primaryAction={{
                content: 'Generate Key',
                onAction: handleCreate,
                disabled: !name || !selectedProject,
            }}
            secondaryActions={[
                {
                    content: 'Cancel',
                    onAction: onClose,
                },
            ]}
        >
            <Modal.Section>
                <FormLayout>
                    {loading ? (
                        <InlineStack align="center" gap="200">
                            <Spinner size="small" />
                            <Text as="span">Loading projects...</Text>
                        </InlineStack>
                    ) : (
                        <>
                            <FormLayout.Group>
                                <Select
                                    label="Project Source"
                                    options={[
                                        { label: 'KMS Internal', value: 'kms' },
                                        { label: 'GitHub', value: 'github', disabled: githubRepos.length === 0 },
                                        { label: 'GitLab', value: 'gitlab', disabled: gitlabProjects.length === 0 },
                                        { label: 'NPM', value: 'npm', disabled: npmPackages.length === 0 },
                                    ]}
                                    onChange={(v) => setProjectSource(v as any)}
                                    value={projectSource}
                                />
                                {projectSource === 'kms' && (
                                    <Select
                                        label="KMS Project"
                                        options={kmsProjects.map((p: any) => ({ label: p.name, value: p.id }))}
                                        onChange={setSelectedProject}
                                        value={selectedProject}
                                    />
                                )}
                                {projectSource === 'github' && (
                                    <Select
                                        label="GitHub Repository"
                                        options={githubRepos.map(r => ({ label: r.full_name, value: r.full_name }))}
                                        onChange={setSelectedProject}
                                        value={selectedProject}
                                    />
                                )}
                                {projectSource === 'gitlab' && (
                                    <Select
                                        label="GitLab Project"
                                        options={gitlabProjects.map(p => ({ label: p.path_with_namespace, value: p.path_with_namespace }))}
                                        onChange={setSelectedProject}
                                        value={selectedProject}
                                    />
                                )}
                                {projectSource === 'npm' && (
                                    <Select
                                        label="NPM Package"
                                        options={npmPackages.map(p => ({ label: p.name, value: p.name }))}
                                        onChange={setSelectedProject}
                                        value={selectedProject}
                                    />
                                )}
                            </FormLayout.Group>

                            <FormLayout.Group>
                                <Select
                                    label="Environment"
                                    options={[
                                        { label: 'Development', value: 'development' },
                                        { label: 'Staging', value: 'staging' },
                                        { label: 'Production', value: 'production' },
                                    ]}
                                    onChange={setEnvironment}
                                    value={environment}
                                />
                                <TextField
                                    label="Key Name"
                                    value={name}
                                    onChange={setName}
                                    autoComplete="off"
                                    placeholder="e.g. Mobile App API"
                                />
                            </FormLayout.Group>

                            <Box paddingBlockStart="200">
                                <BlockStack gap="200">
                                    <Text as="span" variant="bodyMd" fontWeight="bold">Scopes</Text>
                                    <InlineStack gap="400">
                                        {availableScopes.map(scope => (
                                            <Checkbox
                                                key={scope}
                                                label={scope}
                                                checked={selectedScopes.includes(scope)}
                                                onChange={(checked) => handleScopeChange(checked, scope)}
                                            />
                                        ))}
                                    </InlineStack>
                                </BlockStack>
                            </Box>

                            <TextField
                                label="Description (Optional)"
                                value={description}
                                onChange={setDescription}
                                autoComplete="off"
                                multiline={2}
                            />
                        </>
                    )}
                </FormLayout>
            </Modal.Section>
        </Modal>
    );
}
