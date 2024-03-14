export default function useDate() {
  const date = new Date();
  // 자동으로 로컬 설정에 맞는 시간을 가져온다.
  return `${ date.getFullYear() }-${ date.getMonth()+1 }-${ date.getDate() }`
}