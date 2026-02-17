'use client';

import { useState, useCallback } from 'react';
import {
    IndexTable,
    LegacyCard,
    Text,
    Badge,
    TextField,
    Select,
    Button,
    ButtonGroup,
    Tooltip,
    InlineStack,
} from '@shopify/polaris';
import {
    SearchIcon,
    RefreshIcon,
    LockIcon,
    DeleteIcon,
    ClipboardIcon,
    ViewIcon,
    HideIcon
} from '@shopify/polaris-icons';
import type { ApiKey } from '@/lib/types';
import { format } from 'date-fns';
import { apiClient } from '@/lib/api-client';

export function PolarisApiKeyTable({ data, onRefresh }: { data: ApiKey[], onRefresh: () => void }) {
    const resourceName = {
        singular: 'API Key',
        plural: 'API Keys',
    };

    const [queryValue, setQueryValue] = useState('');
    const [sortValue, setSortValue] = useState('createdAt:desc');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'revoked'>('all');

    const handleRevoke = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this API key?')) return;
        setActionLoading(id);
        try {
            await apiClient.revokeApiKey(id);
            onRefresh();
        } catch (error) {
            console.error('Failed to revoke key', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRotate = async (id: string) => {
        if (!confirm('Rotate this API key?')) return;
        setActionLoading(id);
        try {
            await apiClient.rotateApiKey(id);
            onRefresh();
        } catch (error) {
            console.error('Failed to rotate key', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this API key?')) return;
        setActionLoading(id);
        try {
            await apiClient.deleteApiKey(id);
            onRefresh();
        } catch (error) {
            console.error('Failed to delete key', error);
        } finally {
            setActionLoading(null);
        }
    };

    const toggleKeyVisibility = (id: string) => {
        setVisibleKeys(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const copyToClipboard = async (keyValue: string) => {
        try {
            await navigator.clipboard.writeText(keyValue);
            // Could add toast notification here
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleQueryValueChange = useCallback(
        (value: string) => setQueryValue(value),
        [],
    );

    const handleSortChange = useCallback(
        (value: string) => setSortValue(value),
        [],
    );

    // Selection disabled - not useful for this project

    // Note: API doesn't support revoke/rotate/delete individual keys
    // These operations would need to be implemented on the backend first

    const safeData = Array.isArray(data) ? data : [];
    const filteredData = safeData.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(queryValue.toLowerCase()) ||
            (item.projectId && item.projectId.toLowerCase().includes(queryValue.toLowerCase()));
        const matchesFilter = filterStatus === 'all' 
            ? true 
            : filterStatus === 'active' 
                ? item.active 
                : !item.active;
        return matchesSearch && matchesFilter;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        const [key, direction] = sortValue.split(':');
        const dir = direction === 'asc' ? 1 : -1;

        if (key === 'createdAt') {
            return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
        }
        if (key === 'name') {
            return a.name.localeCompare(b.name) * dir;
        }
        return 0;
    });

    const rowMarkup = sortedData.map(
        ({ id, name, key, scopes, createdAt, lastUsed, active, environment, projectId }, index) => {
            const isLoading = actionLoading === id;
            const isRevoked = !active;

            return (
                <IndexTable.Row
                    id={id}
                    key={id}
                    position={index}
                >
                    <IndexTable.Cell>
                        <Text variant="bodyMd" fontWeight="bold" as="span">
                            {name}
                        </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <Text variant="bodyMd" as="span">{projectId || 'N/A'}</Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <InlineStack gap="200" align="start">
                            <Text variant="bodyMd" as="span">
                                <span style={{ fontFamily: 'monospace', color: '#637381' }}>
                                    {visibleKeys.has(id) 
                                        ? key || 'N/A'
                                        : key && key.length > 12 
                                            ? `${key.substring(0, 8)}...${key.substring(key.length - 4)}`
                                            : key || 'N/A'}
                                </span>
                            </Text>
                            <ButtonGroup variant="segmented">
                                <Tooltip content={visibleKeys.has(id) ? 'Hide' : 'Show'}>
                                    <Button
                                        icon={visibleKeys.has(id) ? HideIcon : ViewIcon}
                                        onClick={() => toggleKeyVisibility(id)}
                                        size="slim"
                                    />
                                </Tooltip>
                                <Tooltip content="Copy">
                                    <Button
                                        icon={ClipboardIcon}
                                        onClick={() => copyToClipboard(key || '')}
                                        size="slim"
                                    />
                                </Tooltip>
                            </ButtonGroup>
                        </InlineStack>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <Badge tone={environment === 'production' ? 'critical' : 'info'}>
                            {environment || 'dev'}
                        </Badge>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <InlineStack gap="100">
                            {scopes.map(scope => (
                                <Badge key={scope} tone="info">{scope}</Badge>
                            ))}
                        </InlineStack>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        {format(new Date(createdAt), 'MMM d, yyyy')}
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        {lastUsed ? format(new Date(lastUsed), 'MMM d, yyyy') : 'Never'}
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <Badge tone={active ? 'success' : 'critical'}>
                            {active ? 'Active' : 'Revoked'}
                        </Badge>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <div onClick={(e) => e.stopPropagation()}>
                            <InlineStack align="end">
                                <ButtonGroup variant="segmented">
                                    {!isRevoked && (
                                        <>
                                            <Tooltip content="Rotate">
                                                <Button
                                                    icon={RefreshIcon}
                                                    onClick={() => handleRotate(id)}
                                                    disabled={!!actionLoading}
                                                    loading={isLoading}
                                                />
                                            </Tooltip>
                                            <Tooltip content="Revoke">
                                                <Button
                                                    icon={LockIcon}
                                                    onClick={() => handleRevoke(id)}
                                                    disabled={!!actionLoading}
                                                    tone="critical"
                                                />
                                            </Tooltip>
                                        </>
                                    )}
                                    <Tooltip content="Delete">
                                        <Button
                                            icon={DeleteIcon}
                                            onClick={() => handleDelete(id)}
                                            disabled={!!actionLoading}
                                            tone="critical"
                                        />
                                    </Tooltip>
                                </ButtonGroup>
                            </InlineStack>
                        </div>
                    </IndexTable.Cell>
                </IndexTable.Row>
            );
        }
    );

    const sortOptions = [
        { label: 'Created (Newest first)', value: 'createdAt:desc' },
        { label: 'Created (Oldest first)', value: 'createdAt:asc' },
        { label: 'Name (A-Z)', value: 'name:asc' },
        { label: 'Name (Z-A)', value: 'name:desc' },
    ];

    return (
        <LegacyCard>
            <div style={{ padding: '16px', borderBottom: '1px solid #f1f1f1' }}>
                <InlineStack gap="400" align="space-between" wrap={false}>
                    <div style={{ flex: 1 }}>
                        <TextField
                            label="Search keys"
                            labelHidden
                            value={queryValue}
                            onChange={handleQueryValueChange}
                            prefix={<SearchIcon />}
                            autoComplete="off"
                            placeholder="Search by name or project"
                            clearButton
                            onClearButtonClick={() => setQueryValue('')}
                        />
                    </div>
                    <div style={{ width: '150px' }}>
                        <Select
                            label="Filter"
                            labelHidden
                            options={[
                                { label: 'All Keys', value: 'all' },
                                { label: 'Active', value: 'active' },
                                { label: 'Revoked', value: 'revoked' },
                            ]}
                            onChange={(value) => setFilterStatus(value as 'all' | 'active' | 'revoked')}
                            value={filterStatus}
                        />
                    </div>
                    <div style={{ width: '180px' }}>
                        <Select
                            label="Sort by"
                            labelHidden
                            options={sortOptions}
                            onChange={handleSortChange}
                            value={sortValue}
                        />
                    </div>
                </InlineStack>
            </div>
            <IndexTable
                resourceName={resourceName}
                itemCount={filteredData.length}
                selectable={false}
                headings={[
                    { title: 'Name' },
                    { title: 'Project' },
                    { title: 'Key' },
                    { title: 'Env' },
                    { title: 'Scopes' },
                    { title: 'Created' },
                    { title: 'Last Used' },
                    { title: 'Status' },
                    { title: 'Actions', alignment: 'end' },
                ]}
            >
                {rowMarkup}
            </IndexTable>
        </LegacyCard>
    );
}
