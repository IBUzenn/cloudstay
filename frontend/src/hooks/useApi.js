import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Generic data-fetching hook.
 * @param {Function} apiFn - API function returning a promise
 */
export function useApi(apiFn) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data.data ?? res.data);
      return res.data.data ?? res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return { data, loading, error, execute };
}

/**
 * Form submission hook with toast feedback.
 * @param {Function} apiFn - API function
 * @param {object}   opts  - { successMsg, onSuccess }
 */
export function useSubmit(apiFn, { successMsg, onSuccess } = {}) {
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async (payload) => {
    setLoading(true);
    try {
      const res = await apiFn(payload);
      if (successMsg) toast.success(successMsg);
      if (onSuccess)  onSuccess(res.data.data ?? res.data);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Request failed.';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn, successMsg, onSuccess]);

  return { loading, submit };
}

/** Extract human-readable error message from Axios error */
export function getErrorMessage(err) {
  return err?.response?.data?.message || err?.message || 'An unexpected error occurred.';
}
