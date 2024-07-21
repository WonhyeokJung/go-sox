export default function useDate() {
  const date = new Date();

  // UTC 계산
  const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000)
  // UTC +9
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000
  const KR_DATE = new Date(utc + KR_TIME_DIFF)
  // UTC -5
  const US_CT_TIME_DIFF = -5 * 60 * 60 * 1000
  const US_CT_DATE = new Date(utc + US_CT_TIME_DIFF)
  // 자동으로 로컬 설정에 맞는 시간을 가져온다.
  // const today = `${ date.getFullYear() }-${ date.getMonth()+1 }-${ date.getDate() }`
  // 시카고 시간 기준으로 게임을 가져온다.(사실 ET가 더 정확함)
  const today = `${ US_CT_DATE.getFullYear() }-${ US_CT_DATE.getMonth() + 1 }-${ US_CT_DATE.getDate() - 1 }`
  // 한국 시간 기준으로 게임을 가져온다.
  // const today = `${ KR_DATE.getFullYear() }-${ KR_DATE.getMonth()+1 }-${ KR_DATE.getDate() }`
  // https://statsapi.mlb.com/api/v1/seasons?sportId=1 통해서 시즌 시작 체크 후 연도 돌려주게 설정해야함. 1, 2월 프리시즌 이전 대비
  const year = date.getFullYear()
  // return `${ date.getFullYear() }-${ date.getMonth()+1 }-${ date.getDate() }`
  return {
    today,
    year
  }
}