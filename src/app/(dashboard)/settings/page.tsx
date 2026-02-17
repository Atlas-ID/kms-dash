'use client';

import { useState, useCallback } from 'react';
import {
  Page,
  Layout,
  LegacyCard,
  FormLayout,
  TextField,
  Button,
  BlockStack,
  Banner,
  Toast,
} from '@shopify/polaris';
import { SettingsIcon } from '@shopify/polaris-icons';
import { useAuth } from '@/hooks/use-auth';

export default function SettingsPage() {
  const { adminKey, setAdminKey, logout } = useAuth();
  const [newKey, setNewKey] = useState(adminKey || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = useCallback(() => {
    if (newKey.trim()) {
      setAdminKey(newKey.trim());
      setShowSuccess(true);
      setToastMessage('Admin key updated successfully');
      setToastActive(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [newKey, setAdminKey]);

  const handleLogout = useCallback(() => {
    logout();
    setToastMessage('Logged out successfully');
    setToastActive(true);
  }, [logout]);

  const toggleToast = useCallback(() => setToastActive((active) => !active), []);

  return (
    <Page
      title="Settings"
      subtitle="Manage your admin configuration and preferences"
    >
      <Layout>
        <Layout.Section variant="oneHalf">
          <LegacyCard title="Admin Configuration" sectioned>
            <BlockStack gap="400">
              {showSuccess && (
                <Banner tone="success" onDismiss={() => setShowSuccess(false)}>
                  Admin key updated successfully
                </Banner>
              )}
              <FormLayout>
                <TextField
                  label="Admin API Key"
                  type="password"
                  value={newKey}
                  onChange={setNewKey}
                  autoComplete="off"
                  helpText="This key is stored in your browser's local storage"
                  placeholder="Enter your admin API key"
                />
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={!newKey.trim() || newKey === adminKey}
                  fullWidth
                >
                  Save Changes
                </Button>
              </FormLayout>
            </BlockStack>
          </LegacyCard>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <LegacyCard title="Session" sectioned>
            <BlockStack gap="400">
              <Banner tone="info" icon={SettingsIcon}>
                <p>Your session is active. You can log out at any time.</p>
              </Banner>
              <Button tone="critical" onClick={handleLogout} fullWidth>
                Log Out
              </Button>
            </BlockStack>
          </LegacyCard>
        </Layout.Section>
      </Layout>

      {toastActive && (
        <Toast content={toastMessage} onDismiss={toggleToast} duration={3000} />
      )}
    </Page>
  );
}
