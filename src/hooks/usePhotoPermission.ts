import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {AppState, Platform} from 'react-native';
import {
  PERMISSIONS,
  PermissionStatus,
  check,
  checkMultiple,
  request,
  requestMultiple,
} from 'react-native-permissions';

export const usePhotoPermission = () => {
  const [status, setStatus] = useState<PermissionStatus>('unavailable');
  let map = [
    {min: 1, value: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE},
    {min: 33, value: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES}, // Android13
    {min: 34, value: PERMISSIONS.ANDROID.READ_MEDIA_VISUAL_USER_SELECTED}, // Android14
  ];
  let needCheckedPermissions = map
    .filter(it => (Platform.Version as number) >= it.min)
    .map(it => it.value);

  console.log('Permissions: ', {
    needCheckedPermissions,
    version: Platform.Version,
  });

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
      setStatus(await check(PERMISSIONS.IOS.PHOTO_LIBRARY));
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
