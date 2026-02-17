'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Page,
  Layout,
  Toast,
  LegacyCard,
  Button,
  Spinner,
  InlineStack
} from '@shopify/polaris';
import { PlusIcon, RefreshIcon } from '@shopify/polaris-icons';
import { PolarisApiKeyTable } from '@/components/dashboard/polaris-api-key-table';
import { PolarisCreateApiKeyModal } from '@/components/dashboard/polaris-create-api-key-modal';
import { apiClient } from '@/lib/api-client';
import { ApiKey } from '@/lib/types';

export default function ApiKeysPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [toastError, setToastError] = useState<string | null>(null);
  const [toastSuccess, setToastSuccess] = useState<string | null>(null);
  const [toastActive, setToastActive] = useState(false);

  const toggleToast = useCallback(() => {
    setToastActive((active) => !active);
    if (toastActive) {
      setToastError(null);
      setToastSuccess(null);
    }
  }, [toastActive]);

  const fetchKeys = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const data = await apiClient.getApiKeys();
      setKeys(data);
    } catch (error: any) {
      console.error('Failed to fetch keys', error);
      setToastError(error.message || 'Failed to fetch API keys');
      setToastActive(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreate = async (data: any) => {
    try {
      await apiClient.createApiKey(data);
      await fetchKeys();
      setToastSuccess('API key created successfully!');
      setToastActive(true);
      setIsCreateModalOpen(false);
    } catch (error: any) {
      console.error('Failed to create key', error);
      setToastError(error.message || 'Failed to create API key');
      setToastActive(true);
    }
  };

  const toggleModal = useCallback(() => setIsCreateModalOpen((active) => !active), []);

  const toastMarkup = toastActive ? (
    <Toast
      content={toastError || toastSuccess || ''}
      error={!!toastError}
      onDismiss={toggleToast}
      duration={4000}
    />
  ) : null;

  if (isLoading) {
    return (
      <Page>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <Spinner size="large" />
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="API Keys"
      subtitle="Manage your API keys and access tokens"
      primaryAction={{
        content: 'Create Key',
        icon: PlusIcon,
        onAction: toggleModal,
      }}
      secondaryActions={[
        {
          content: 'Refresh',
          icon: RefreshIcon,
          onAction: () => fetchKeys(true),
          loading: isRefreshing,
        }
      ]}
    >
      <Layout>
        <Layout.Section>
          <PolarisApiKeyTable data={keys} onRefresh={() => fetchKeys(true)} />
        </Layout.Section>
      </Layout>

      <PolarisCreateApiKeyModal
        open={isCreateModalOpen}
        onClose={toggleModal}
        onCreate={handleCreate}
      />
      {toastMarkup}
    </Page>
  );
}
