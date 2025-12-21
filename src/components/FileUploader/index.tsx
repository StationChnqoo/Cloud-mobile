import {PicGoSrc} from '@src/constants/t';
import {toast} from '@src/constants/u';
import {usePhotoPermission} from '@src/hooks/usePhotoPermission';
import {usePicGoUpload} from '@src/hooks/usePicGoUpload';
import {produce} from 'immer';
import React, {useEffect, useState} from 'react';
import {Alert, Linking, Platform, StyleSheet, Text, View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageView from 'react-native-image-viewing';
import Flex from '../Flex';
import InputDialog from '../InputDialog';
import MoreButton from '../MoreButton';
import PicGoFile from '../PicGoFile';
import Spinner from '../Spinner';

interface FileUploaderProps {
  images: PicGoSrc[];
  setImages: (images: PicGoSrc[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({images, setImages}) => {
  const [srcIndex, setSrcIndex] = useState(0);
  const {status: photoPermission, requestPermission} = usePhotoPermission();
  const [isOpenPreviewer, setIsOpenPreviewer] = useState(false);
  const [isOpenInputer, setIsOpenInputer] = useState(false);
  const [editIndex, setEditIndex] = useState(0);

  const link2PhotoSetting = () => {
    Alert.alert('提示', '需要获取相册权限，是否前往设置页面进行设置？', [
      {text: '确认', onPress: () => Linking.openSettings()},
      {text: '取消', onPress: () => {}},
    ]);
  };

  const {uploading, upload, picGo, progress} = usePicGoUpload();
  const onMoveUp = (index: number) => {
    if (index > 0) {
      setImages(
        produce(images, draft => {
          [draft[index], draft[index - 1]] = [draft[index - 1], draft[index]];
        }),
      );
    }
  };

  const onMoveDown = (index: number) => {
    if (index < images.length - 1) {
      setImages(
        produce(images, draft => {
          [draft[index], draft[index + 1]] = [draft[index + 1], draft[index]];
        }),
      );
    }
  };

  useEffect(() => {
    // const {id_encoded, size, url, title, date} = result.data;
    // onImageUploaded({id: id_encoded, size, url, title, date});
    if (picGo?.url) {
      let {url, key, id, size, date} = picGo;
      let image = {id, size, url, name: key, date};
      setImages([...images, image]);
      console.log('PicGo: ', picGo);
    } else {
    }
  }, [picGo]);

  const onImageDelete = (id: string) => {
    Alert.alert('提示', '删除后不可恢复，请谨慎操作', [
      {text: '取消', onPress: () => {}},
      {
        text: '确定',
        onPress: () => {
          setImages(images.filter(it => it.id !== id));
          toast('删除成功');
        },
      },
    ]);
  };

  const onPhotoSelect = async () => {
    console.log('Photo Permission: ', {
      Android: Platform.Version,
      Permission: photoPermission,
    });

    switch (photoPermission) {
      case 'granted':
      case 'limited': {
        let assest = await launchImageLibrary({
          includeBase64: true,
          mediaType: 'photo',
        });
        if (!assest.didCancel && assest.assets?.length) {
          upload(assest.assets[0]);
        }
        break;
      }
      case 'blocked':
        link2PhotoSetting();
        break;
      case 'denied': {
        let p = await requestPermission();
        if (p === 'blocked') {
          link2PhotoSetting();
        }
        break;
      }
    }
  };

  const onEdit = (index: number) => {
    setIsOpenInputer(true);
    setEditIndex(index);
  };

  const doEdit = (s: string) => {
    setImages(
      produce(images, draft => {
        draft[editIndex].name = s;
      }),
    );
    setIsOpenInputer(false);
  };

  return (
    <View>
      <Flex horizontal justify="space-between">
        <Text style={styles.label}>附件</Text>
        <MoreButton
          onPress={onPhotoSelect}
          disabled={uploading}
          label="请选择"
        />
      </Flex>
      {images.map((it, i) => (
        <View key={it.id} style={{marginTop: 10}}>
          <PicGoFile
            src={it}
            onDelete={() => onImageDelete(it.id)}
            onPreview={() => {
              setSrcIndex(i);
              setIsOpenPreviewer(true);
            }}
            onMoveUp={() => {
              onMoveUp(i);
            }}
            onMoveDown={() => {
              onMoveDown(i);
            }}
            onEdit={() => {
              onEdit(i);
            }}
          />
        </View>
      ))}
      <ImageView
        images={images.map(it => ({uri: it.url}))}
        imageIndex={srcIndex}
        visible={isOpenPreviewer}
        onRequestClose={() => setIsOpenPreviewer(false)}
      />
      <InputDialog
        title={'请输入'}
        message={'请输入文件名称'}
        show={isOpenInputer}
        onClose={() => {
          setIsOpenInputer(false);
        }}
        onShow={() => {}}
        onConfirm={doEdit}
      />
      <Spinner visible={uploading} text={`正在上传 ${progress}% ...`} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontWeight: '500',
    textAlignVertical: 'center',
  },
});

export default FileUploader;
