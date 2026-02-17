'use client';

import {
  Page,
  Layout,
  LegacyCard,
  FormLayout,
  TextField,
  Button,
  Box,
  Text,
  InlineStack,
  BlockStack,
  Loading
} from '@shopify/polaris';
import { ShieldCheckMarkIcon, LockIcon } from '@shopify/polaris-icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';

export default function LoginPage() {
  const [adminKey, setAdminKeyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setAdminKey } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      apiClient.setToken(adminKey);
      await apiClient.getApiKeys(); // Validate key

      setAdminKey(adminKey);
      router.push('/keys');
    } catch (err) {
      setError('Invalid Admin Key provided.');
      apiClient.setToken('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f6f6f7'
    }}>
      <div style={{ width: '400px' }}>
        <LegacyCard sectioned>
          <BlockStack gap="400">
            <Box paddingBlockEnd="400">
              <InlineStack align="center" gap="200">
                <ShieldCheckMarkIcon style={{ width: '32px', height: '32px', color: '#008060' }} />
                <Text variant="headingLg" as="h1">KeyMaster Admin</Text>
              </InlineStack>
            </Box>

            <Text as="p" tone="subdued" alignment="center">
              Enter your secret Admin Key to manage your API infrastructure.
            </Text>

            <FormLayout>
              <TextField
                label="Admin API Key"
                value={adminKey}
                onChange={setAdminKeyInput}
                type="password"
                autoComplete="off"
                placeholder="sk_admin_..."
                error={error}
                prefix={<LockIcon style={{ width: '20px', color: '#8c9196' }} />}
              />
              <Button
                variant="primary"
                fullWidth
                size="large"
                onClick={handleLogin}
                loading={isLoading}
                disabled={!adminKey}
              >
                Sign In
              </Button>
            </FormLayout>
          </BlockStack>
        </LegacyCard>

        <Box padding="400">
          <Text as="p" tone="subdued" alignment="center" variant="bodySm">
            Secure enterprise API management.
          </Text>
        </Box>
      </div>
    </div>
  );
}
