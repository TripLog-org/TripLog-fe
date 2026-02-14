import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

/** 화면에 포커스될 때마다 refetch 실행 */
export function useRefreshOnFocus(refetch: () => void) {
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );
}
