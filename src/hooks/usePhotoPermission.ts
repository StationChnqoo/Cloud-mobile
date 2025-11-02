import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {AppState, Platform} from 'react-native';
import {
  PERMISSIONS,
  PermissionStatus,
  checkMultiple,
  request,
  requestMultiple,
} from 'react-native-permissions';

export const usePhotoPermission = () => {
  const [status, setStatus] = useState<PermissionStatus>('unavailable');

  let needCheckedPermissions = [
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  ] as any[];
  if (Platform.Version == 33) {
    needCheckedPermissions.push(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
  } else if ((Platform.Version as number) >= 34) {
    needCheckedPermissions.push(
      PERMISSIONS.ANDROID.READ_MEDIA_VISUAL_USER_SELECTED,
    );
  }

  const setMultipleStatus = (maps: any) => {
    // console.log('setMultipleStatus: ', maps);
    let values = Object.keys(maps).map(it => maps[it]);
    return values.every(it => it == 'denied')
      ? 'denied'
      : values.every(it => it == 'blocked')
      ? 'blocked'
      : 'granted';
  };

  const checkPermission = async () => {
    if (Platform.OS == 'android') {
      let maps = await checkMultiple(needCheckedPermissions);
      setStatus(setMultipleStatus(maps));
    } else if (Platform.OS == 'ios') {
      setStatus(await request(PERMISSIONS.IOS.PHOTO_LIBRARY));
    }
  };

  const requestPermission = async () => {
    let s: PermissionStatus;
    if (Platform.OS == 'android') {
      let maps = await requestMultiple(needCheckedPermissions);
      s = setMultipleStatus(maps);
    } else if (Platform.OS == 'ios') {
      s = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    }
    setStatus(s);
    return s;
  };

  useFocusEffect(
    useCallback(() => {
      checkPermission();
    }, []),
  );

  useEffect(() => {
    const listener = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkPermission();
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  return {status, checkPermission, requestPermission};
};
