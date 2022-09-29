<template>
  <input
    type="file"
    name="file"
    @change="getFile"
    :accept="accept"
    :id="uploadId"
    multiple
    class="upload"
  />
  <AtMessage />
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  computed,
  reactive,
} from "vue";
import { AtMessage } from "taro-ui-vue3";
import "taro-ui-vue3/dist/style/components/message.scss";
import { fullUrl } from "../service/http";
import httpRequest from "../utils/httpRequest";
import Taro from "@tarojs/taro";
import Uploader from "../utils/miniprogram-uploader/upload";
import SparkMD5 from "spark-md5";
import * as Util from '../utils/miniprogram-uploader/util'

interface UploaderFile {
  name: string,
  size: number,
  type: string,
  md5: string,
  lastModified: number,
  lastModifiedDate: Date,
  webkitRelativePath: string,
  percentage: number,
}

export default defineComponent({
  name: "ChunkUpload",
  components: {
    AtMessage,
  },
  props: {
    domId: {
      //绑定的dom
      type: String as PropType<string>,
      required: true,
    },
    type: {
      //要上传的文件类型
      type: String as PropType<string>,
      required: true,
      default: "image",
      validator: function (value: string) {
        return ["image", "video", "audio"].indexOf(value) !== -1;
      },
    },
    typeMap: {
      //可接收的具体文件类型
      type: Object,
      default: () => {
        return {
          image: ["gif", "jpg", "jpeg", "png", "bmp", "webp"],
          video: ["mp4", "m3u8", "rmvb", "avi", "swf", "3gp", "mkv", "flv"],
          audio: ["mp3", "wav", "wma", "ogg", "aac", "flac"],
        };
      },
    },
    fileNum: {
      type: Number as PropType<number>,
      default: 1,
    },
    chunkSize: {
      //分块文件大小
      type: Number as PropType<number>,
      default: 4096, //单位 kb
    },
    splitChunk: {
      //是否分片
      type: Boolean as PropType<boolean>,
      default: true,
    },
    verifyUrl: {
      type: String as PropType<string>,
      default: "box/upload/miniprogram/verify",
    },
    uploadUrl: {
      type: String as PropType<string>,
      default: "box/upload/miniprogram/upload",
    },
    mergeUrl: {
      type: String as PropType<string>,
      default: "box/upload/miniprogram/merge",
    },
    attachData: {
      //上传时附加的其他字段
      type: Object as PropType<object>,
      default: function () {
        return {
          prefix: "fb",
        };
      },
    },
  },
  setup(props) {
    const uploadId = computed((): any => {
      return props.domId + "-fileUpload";
    });
    const accept = computed((): any => {
      let ret = [] as string[];
      props.typeMap[props.type].forEach((ele: string) => {
        ret.push(props.type + "/" + ele);
      });
      return ret;
    });
    let uploadFile = (
      filepath: string,
      filesize: number,
      _fileType: string
    ) => {
      const uploader = new Uploader({
        tempFilePath: filepath,
        totalSize: filesize,
        verifyUrl: fullUrl(props.verifyUrl),
        uploadUrl: fullUrl(props.uploadUrl),
        mergeUrl: fullUrl(props.mergeUrl),
        query: {}, //自定义参数，
        testChunks: true, //秒传验证
        maxChunkRetries: 3, //最大重试测试
        chunkRetryInterval: 1000, //最大重试间隔
        verbose: true, //开启日志
      });
      uploader.on("complete", (res) => {
        console.log("upload complete", res);
      });
      // 文件上传成功
      uploader.on("success", (res) => {
        console.log("upload success", res);
        if (res.ret != 0) {
          Taro.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000,
          });
          return;
        }
        //保存文件和文件类型
        // if(res.url){
        //     formData.material.push(res.url)
        //     fileTypeArr.push(fileType)
        //     this.setData({
        //         "formData.material":formData.material,
        //         fileTypeArr: fileTypeArr
        //     })
        // }
      });
      // 文件上传失败
      uploader.on("fail", (res) => {
        console.log("fail", res);
      });
      // 文件进度变化
      uploader.on("progress", (res) => {
        console.log("uploader on", res);
      });
      uploader.upload();
    };
    onMounted(() => {
      let btnDom = document.getElementById(props.domId);
      let uploadDom = document.getElementById(uploadId.value);
      // let uploadDom = ref(uploadId.value);

      if (Taro.getEnv() === "WEAPP") {
        btnDom?.addEventListener(
          "tap",
          function (_e) {
            console.log("click");
            Taro.chooseMedia({
              count: 9,
              mediaType: ["video"],
              sourceType: ["album", "camera"],
              maxDuration: 30,
              camera: "back",
              success: (res) => {
                console.log(res.tempFiles);
                uploadFile(
                  res.tempFiles[0].tempFilePath,
                  res.tempFiles[0].size,
                  res.type
                );
                // getFile(e, res.tempFiles)
                // videoUrl.tempFilePath = res.tempFiles[0].tempFilePath;
                // videoUrl.thumbTempFilePath = res.tempFiles[0].thumbTempFilePath;
                console.log(res.type);
              },
            });
          },
          false
        );
      } else {
        btnDom?.addEventListener(
          "click",
          function (_e) {
            uploadDom?.children[0].setAttribute("accept", accept.value);
            uploadDom?.children[0].click();
            // console.log(uploadDom?.children[0]);
            // console.log("click");
          },
          false
        );
      }
    });
    let mergeFile = (file: UploaderFile) => {
      console.log("mergeFile", file);
      httpRequest
        .post(fullUrl(props.mergeUrl), {
          fileName: file.name,
          identifier: file.md5,
        })
        .then((res) => {
          console.log("mergeFile suc", res);
          // this.$emit("success", res.data.url, props.type);
        })
        .catch((e) => {
          console.warn("mergeFile error", e);
        });
    };

    let splitChunkUpload = (file: UploaderFile, ignoreChunks: any) => {
      console.log("splitChunkUpload", file, ignoreChunks);
      let chunkSize = props.chunkSize * 1024;
      let chunks = Math.ceil(file.size / chunkSize);
      // let attachData = this.$tool.deepClone(this.attachData);
      const attachData = reactive(props.attachData);

      file.percentage = 0;
      for (let currentChunk = 0; currentChunk < chunks; currentChunk++) {
        if (ignoreChunks.indexOf(currentChunk) > -1) {
          continue;
        }
        let start = currentChunk * chunkSize;
        let end =
          start + chunkSize >= file.size ? file.size : start + chunkSize;
        let fileChunk = file.slice(start, end);
        let postData = new FormData();
        Object.keys(attachData).forEach((ele) => {
          postData.append(ele, attachData[ele]);
        });
        postData.set("file", fileChunk);
        postData.set("identifier", file.md5);
        postData.set("index", currentChunk.toString());
        postData.set("chunkSize", chunkSize.toString());
        postData.set("fileName", file.name);
        postData.set("totalChunks", chunks.toString());
        postData.set("totalSize", file.size);
        let lastPercentage = 0; //上一次回调的进度
        console.log(postData.set);
        console.log(file.md5);
        const url = Util.addParams(props.uploadUrl, {
          identifier: file.md5,
          index: currentChunk.toString(),
          chunkSize: chunkSize.toString(),
          fileName: file.name,
          totalChunks: chunks.toString(),
          totalSize: file.size
        })

        httpRequest
          .post(fullUrl(url), postData, {
            headers: { "Content-Type": "application/octet-stream" },
            //设置分片进度条
            onUploadProgress: (progressEvent) => {
              let percentage =
                (progressEvent.loaded / progressEvent.total / chunks) * 100;
              console.log(
                `[${currentChunk}]分片上传进度：`,
                percentage,
                lastPercentage
              );
              file.percentage = file.percentage - lastPercentage + percentage;
              lastPercentage = percentage;
              console.log("分片上传进度：", file.percentage);
            },
          })
          .then((res) => {
            console.log("splitChunkUpload suc", currentChunk, res);
            //最后一片发送合并请求
            if (currentChunk + 1 >= chunks) {
              mergeFile(file);
            }
          })
          .catch((e) => {
            console.log("splitChunkUpload error", currentChunk, e);
          });
      }
    };
    let verifyFile = (file: UploaderFile) => {
      return new Promise((resolve, reject) => {
        // Request('POST',fullUrl(props.verifyUrl), qs.stringify({ fileName: file.name, identifier: file.md5 }),{ 'Content-Type': 'application/x-www-form-urlencoded' })
        //   .then((res) => {
        //     console.log("verifyFile suc", res);
        //     if (!res.data.needUpload) {
        //       reject("not needUpload");
        //     } else {
        //       resolve(res.data.uploadedChunks);
        //     }
        //   })
        //   .catch((e) => {
        //     console.log("verifyFile error", e);
        //     reject("verifyFile error");
        //   });
        httpRequest
          .post(fullUrl(props.verifyUrl), {
            fileName: file.name,
            identifier: file.md5,
          })
          .then((res) => {
            console.log("verifyFile suc", res);
            if (!res.needUpload) {
              reject("not needUpload");
            } else {
              resolve(res.uploadedChunks);
            }
          })
          .catch((e) => {
            console.log("verifyFile error", e);
            reject("verifyFile error");
          });
      });
    };

    let upload = (file: UploaderFile) => {
      console.log("upload", file);
      if (props.splitChunk) {
        //秒传验证
        verifyFile(file).then((ignoreChunks) => {
          //开始分片上传
          splitChunkUpload(file, ignoreChunks);
        });
      } else {
        //todo 直接上传
      }
    };
    let getFileMd5 = (file: UploaderFile) => {
      return new Promise((resolve, reject) => {
        console.log(File.prototype, "File.prototype");
        let blobSlice =
          File.prototype.slice ||
          File.prototype.mozSlice ||
          File.prototype.webkitSlice;

        let fileReader = new FileReader();
        let chunkSize = props.chunkSize * 1024;
        let chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        let spark = new SparkMD5.ArrayBuffer();
        fileReader.onload = function (e) {
          spark.append(e.target.result);
          currentChunk++;
          if (currentChunk < chunks) {
            loadNextMd5();
          } else {
            let md5Value = spark.end();
            file.md5 = md5Value;
            console.log(file.name + " computed hash", md5Value);
            resolve(file);
          }
        };
        fileReader.onerror = function () {
          console.warn(file.name + "FileReader error");
          reject("FileReader error");
        };
        function loadNextMd5() {
          let start = currentChunk * chunkSize;
          let end =
            start + chunkSize >= file.size ? file.size : start + chunkSize;
          // 注意这里的 fileRaw
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNextMd5();
      });
    };

    let startUpload = (file: UploaderFile) => {
      console.log("startUpload", file);
      //todo 校验文件尺寸
      //获取md5值
      getFileMd5(file)
        .then((f) => {
          upload(f);
        })
        .catch((e) => {
          console.log(e);

          Taro.atMessage({
            message: "获取md5失败：" + file.name,
            type: "error",
          });
        });
    };

    let getFile = (e: any) => {
      // console.log("getFile", e, e.target.files);
      console.log("getFile", e);
      // 判读文件数量
      if (e.target.firstChild.files.length > props.fileNum) {
        Taro.atMessage({
          message: "文件数量超过限制：" + props.fileNum,
          type: "error",
        });
        return;
      }
      //过滤错误的文件类型
      if (e.target.firstChild.files[0].type.indexOf(props.type) > -1) {
        startUpload(e.target.firstChild.files[0]);
      } else {
        Taro.atMessage({
          message: "文件类型错误：" + e.target.firstChild.files[0].name,
          type: "error",
        });
      }
    };

    return {
      uploadId,
      accept,
      getFile,
    };
  },
});
</script>

<style lang="scss" scoped>
.upload {
  display: none;
}
</style>
