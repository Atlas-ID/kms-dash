'use client';

import { sileo } from 'sileo';

export function useSileo() {
  const success = (title: string, description?: string) => {
    return sileo.success({
      title,
      description,
    });
  };

  const error = (title: string, description?: string) => {
    return sileo.error({
      title,
      description,
    });
  };

  const info = (title: string, description?: string) => {
    return sileo.info({
      title,
      description,
    });
  };

  const warning = (title: string, description?: string) => {
    return sileo.warning({
      title,
      description,
    });
  };

  const loading = (title: string, description?: string) => {
    return sileo.show({
      title,
      description,
    });
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      sileo.dismiss(toastId);
    } else {
      sileo.clear();
    }
  };

  return {
    success,
    error,
    info,
    warning,
    loading,
    dismiss,
    sileo,
  };
}
