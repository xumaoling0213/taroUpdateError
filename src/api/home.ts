import request from '@/api/http'

// 获取游戏列表
export function getGameList(data:object) {
  return request({
    url: '/box/forum/game/list',
    method: 'post',
    data,
  })
}

// 互动接口
export function saveInteractive(data:object) {
  return request({
    url: '/box/forum/user/interactive',
    method: 'post',
    data,
  })
}

// 登录
export function getLogin(data:object) {
  return request({
    url: '/box/forum/login',
    method: 'post',
    data
  })
}

// 保存用户信息
export function saveUserInfo(data:object) {
  return request({
    url: '/box/forum/save_userinfo',
    method: 'post',
    data,
  })
}

// 获取帖子列表
export function getPostList(data:object) {
  return request({
    url: '/box/forum/post/list',
    method: 'post',
    data,
  })
}

// 获取帖子详情
export function getPostDetails(data:object) {
  return request({
    url: '/box/forum/post/details',
    method: 'post',
    data
  })
}

// 获取评论列表
export function getCommentList(data:object) {
  return request({
    url: '/box/forum/comment/list',
    method: 'post',
    data
  })
}

// 获取用户被点赞信息
export function getUserAgreeList(data:object) {
  return request({
    url: '/box/forum/user/get_like_list',
    method: 'post',
    data
  })
}

// 获取被评论消息
export function getUserCommentList(data:object) {
  return request({
    url: '/box/forum/user/get_comment_list',
    method: 'post',
    data
  })
}

// 获取发表的帖子
export function getUserPublishList(data:object) {
  return request({
    url: '/box/forum/user/publish_post_list',
    method: 'post',
    data
  })
}

// 获取收藏的帖子
export function getUserCollectList(data:object) {
  return request({
    url: '/box/forum/user/collect_post_list',
    method: 'post',
    data
  })
}

// 发帖
export function postPublish(data:object) {
  return request({
    url: '/box/forum/post/publish',
    method: 'post',
    data
  })
}

// 评论
export function publishComment(data:object) {
  return request({
    url: '/box/forum/comment/publish',
    method: 'post',
    data
  })
}

// 点赞
export function getUserLikeInfo(data:object) {
  return request({
    url: '/box/forum/user/get_like_list',
    method: 'post',
    data
  })
}

// 上报点赞
export function postUserLikeInfo(data:object) {
  return request({
    url: '/box/forum/user/read_like',
    method: 'post',
    data
  })
}

// 用户收到所有点赞改成已读
export function updateUserLikeInfo(data:object) {
  return request({
    url: '/box/forum/user/read_all_like',
    method: 'post',
    data
  })
}

// 上报评论读取状态
export function postUserReadComment(data:object) {
  return request({
    url: '/box/forum/user/read_comment',
    method: 'post',
    data
  })
}

// 收藏
export function userCollect(data:object) {
  return request({
    url: '/box/forum/user/collect',
    method: 'post',
    data
  })
}

// 订阅上报
export function subscribeReport(data:object) {
  return request({
    url: '/box/forum/subscribe/report',
    method: 'post',
    data
  })
}

// 搜索
export function querySearch(data:object) {
  return request({
    url: '/box/forum/search',
    method: 'post',
    data
  })
}