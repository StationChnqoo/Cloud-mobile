import {useState} from 'react';

import axios from 'axios';
import {Asset} from 'react-native-image-picker';
import {Envs} from '@src/constants/env';

export const usePicGoUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [picGo, setPicGo] = useState<any>(null);

  const upload = async (file: Asset) => {
    let instance = axios.create({
      baseURL: 'https://www.picgo.net',
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-API-Key':
          'chv_Sv9El_7ff463cfaef0effecbf147e011dae9f648d9395f6ecf2ab27661db8e68e4fd26468f30a514ec7bc3e5855c46dcfa7f1e26b4e843bcdda85898b3a206eceb8c2c',
      },
    });

    let formData = new FormData();
    formData.append('source', {
      uri: file.uri,
      type: file.type,
      name: file.fileName,
    });
    // formData.append('source', 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAsVBMVEUAAAAgGxEgGRIgGBQhFxQgGhIgHBAiGBIiFxQgGhIhGBMhGBMgGRIhGRIgGRIhGBMhGBMhGhIfGRMgGhEhGBMgGxIhGRIhGBMgFxUhGBMhGBIhGBMgGhIhGBMhGBIhGRMgGhIgGRIeGA8gGhIgGRIgFxIiGhIhGBIlFhIgGhIhFxMhGRMgGxIhGBMfGxIgGxAhGBMhGBIfGRIfHx82FQAgGxIjFxMiGRMgGxIiFxQjGBUvdshFAAAAOHRSTlMAv4BAv39AKdTIpY5p56macVV6dmNdS0UX9d/a1K2glYogELJZOy0cDfHtxLu1Ui/NODIIBPmFhBIxicQAAAO5SURBVHja7duJcqJAEIDhdkxAJN5XPOJtNPe5SeP7P9gyArYCCroNs7vhr1TFwinnC2MENIEDCeRLwJEyQAbIAH8t4JIRcPlne0Ac69JObL7otveNaw/AuTHtgfMB2R7I9kACe0ATe7nUvdgAIhQQ9gKX29uYATJABsgAoYB/8qU4A2SAHw6omY8l5Kv0aNbghF4ekL/HVcoXZcFuIV5LTKheTEARk6oBcWpjci3jABqYXM9xABVMrnEcQA6TK3cSICd4uhS5MwHAVQbIAP81oKMpBhg5tYAaoqYUMKBhSgAtOU5TCOjROCWAK2egpgxwRwNVAOjcSVMEQBqp7NfQHZYBMgAIN2UAdMsAPwXw3mo8fygEaF373gddGUDHTUVlgBE6ve0ANE1uSeV1gAYIAtgCOiwnDmih02QX8Cy3XKcDmA5QVoZdQNW+dQcRi4YjFgDoA29+AtzYtww4UBPdWjwAEO56E2CBdvWId/5oAD+gjHYvcLCWgWg8QzIAb34DjjWZMF5L130AgbJaGhfzdEHSJsAQZRVID1Cz773aAl5RNpgE93rt6+miXG9P2QEd+QN7gC7KHv1jbs2C5fUgprwAKNl3vzuA8M9kPr+61m79K15AnY6Gm/wPf/1k+TO5AHREbmwBVd/dCyukEicAvtH5RQjd/0tvvxer+Xyz8mo5vXICwHBmDh13Ycm623XpFGgVWAD03kA5bAGqzjP/A6iRI1hwAmjc3PcE7Mm5irDXfAO4YQXAOPztiaac6v7TfzzcCHQGQORbREM5U+C4oN/LzU1eADTCAHKmfnDsDa0BHwCMIGB6YKKx3F7gBoggQJcT1UPWi16MGAEQBOTlRHmgaLsdN2DRl2eaigB0tjvTFQFa3sgBCZYOIJgDeLvmBNwEPpJ9K1tRmXyAz19bwMA9C7JiVGIDvCAFm2ZWnATbEtz5Af1YgAobYIZe7rHPitUFG2Dpjfy1IEDv2POcGQC3pf1zUnr4lACwMuVF5xwiAfPmih9ARQLK67WhElBc201SBehCp81DOX/3I03AdWFd2Aoqa5lIdQmq6/VWMKL50wRsBSbNn+oSeIIxzZ/uk9AVfNP8aQJIQPOnCSABzZ86gAQCzgZENBSHASQQcCrgCWM3PAQggYCTAWOMnzgKgFW1A6cDmnhCU6C4zgc6pwBeAo9faucPNo8FgNHZfyrcteL0BFH1z10CIxbAhMhmGDPfGXYjFqAN0dV65/03b4XhusRp1anPchGZIT9Kp3h/dPbe8B38/QakERSbEbhBDAAAAABJRU5ErkJggg==');
    formData.append('album_id', new Envs().get('APP_PICGO'));
    setUploading(true);
    try {
      let result: any = await instance.post('/api/1/upload', formData, {
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          console.log('usePicGoUpload: ', percentCompleted);
          // console.log(`-> Pic Go: ${percentCompleted}%`);
          setProgress(percentCompleted);
        },
        
      });
      console.log('usePicGoUpload: ', result?.data);
      setPicGo(result.data);
      setUploading(false);
    } catch (e) {
      setUploading(false);
    }
  };

  return {progress, uploading, upload, picGo};
};
