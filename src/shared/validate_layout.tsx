import { useEffect, useState } from "react";
import { PATH_ROUTE } from "../constants/routes";
import { KEY_STORAGE } from "../constants/storages";
import { _getStorage } from "../utils/local-storage";
import { useRouter } from "next/router";

export const validHeader = () => {
  const route = useRouter();
  const [isLayout, setisLayout] = useState(false);

  useEffect(() => {
    (async () => {
      const getToken =await _getStorage(KEY_STORAGE.SET_TOKEN)

      if (PATH_ROUTE.AUTH.LOGIN === route.pathname) {
        setisLayout(false);
        console.log('false')
      } else {
        if(getToken){

          console.log('getToken======:: ',getToken)
          console.log('true')
          setisLayout(true);
        }else{
          console.log('route')
          route.push(PATH_ROUTE.AUTH.LOGIN)
        }
      }
    })();
  }, [route.pathname, route.isReady]);

  return isLayout;
};
