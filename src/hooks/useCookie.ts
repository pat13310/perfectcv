import { useState, useCallback } from 'react';
import Cookies from 'js-cookie';

export const useCookie = (name: string, defaultValue?: string) => {
  const [value, setValue] = useState<string | undefined>(() => {
    const cookie = Cookies.get(name);
    if (cookie) return cookie;
    if (defaultValue) {
      Cookies.set(name, defaultValue);
      return defaultValue;
    }
    return undefined;
  });

  const updateCookie = useCallback((newValue: string, options?: Cookies.CookieAttributes) => {
    Cookies.set(name, newValue, options);
    setValue(newValue);
  }, [name]);

  const deleteCookie = useCallback(() => {
    Cookies.remove(name);
    setValue(undefined);
  }, [name]);

  return [value, updateCookie, deleteCookie] as const;
};
