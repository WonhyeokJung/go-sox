<script setup lang="ts">
  import { useScheduleStore } from '@/stores'
  import { storeToRefs } from 'pinia'

  defineProps<{ locale:string, getTranslation: Function }>()
  const gameSchedule = useScheduleStore()
  const { getSchedule, getLiveGame, getBoxScore } = storeToRefs(gameSchedule)
  const { fetchSchedule } = gameSchedule

  fetchSchedule()
  // Final, Postponed, Scheduled
</script>
<template>
  <div class="schedule">
    <h1>{{ getTranslation(locale, 'scheduleTitle') }}</h1>
    <div v-if="!getSchedule">{{ getTranslation(locale, 'noGame') }}</div>
    <div class="schedule__game" v-for="(el, idx) in getSchedule" :key="idx">
      <!-- 메인 결과 -->
      <div class="schedule__game-info">
        <div class="away">
          <div class="team mobile">{{ getTranslation(locale, el.teams.away.team.name) }}</div>
          <div class="team desktop">{{ el.teams.away.team.name }}</div>
          <div class="side">AWAY</div>
          <div class="record">
            {{ el.teams.away.leagueRecord.wins }}-{{ el.teams.away.leagueRecord.losses }} {{ el.teams.away.leagueRecord.pct }}
          </div>
          <div class="is-winner" v-if="el.status.detailedState === 'Final'">
            <div v-if="el.teams.away.isWinner">W</div>
            <div v-else>L</div>
          </div>
        </div>

        <div class="description">
          <div class="status" style="text-transform: uppercase;">{{ getTranslation(locale, el.status.detailedState) }}</div>
          <div class="detail" v-if="el.status.detailedState === 'Postponed'">{{ el.status.reason }}</div>
          <div class="venue">{{ el.venue.name }}</div>
          <div class="score">{{ el.teams.away.score }} - {{ el.teams.home.score }}</div>
        </div>

        <div class="home">
          <div class="team mobile">{{ getTranslation(locale, el.teams.home.team.name) }}</div>
          <div class="team desktop">{{ el.teams.home.team.name }}</div>
          <div class="side">HOME</div>
          <div class="record">
            {{ el.teams.home.leagueRecord.wins }}-{{ el.teams.home.leagueRecord.losses }} {{ el.teams.home.leagueRecord.pct }}
          </div>
          <div class="is-winner" v-if="el.status.detailedState === 'Final'">
            <div v-if="el.teams.home.isWinner">W</div>
            <div v-else>L</div>
          </div>
        </div>
      </div> <!-- game information -->
      <div class="line-score" v-if="getLiveGame && getLiveGame[idx]">
        <div class="line-score-wrapper">
        <table class="line-score-table">
          <thead>
            <tr>
              <th class="team">Team</th>
              <!-- 연장 간 경우만 innings에서 inning 받아와 출력 -->
              <th class="innings" v-if="getLiveGame![idx].liveData.linescore.innings.length >= 10" v-for="(inning, i) in getLiveGame![idx].liveData.linescore.innings" :key="i">{{ inning.num }}</th>
              <th class="innings" v-if="getLiveGame![idx].liveData.linescore.innings.length < 10" v-for="(num, i) in 9" :key="i">{{ num }}</th>
              <th class="runs">R</th>
              <th class="hits">H</th>
              <th class="errors">E</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="team">{{ getLiveGame![idx].gameData.teams.away.abbreviation }}</th>
              <!-- makeup 게임에선 첫이닝이 작성되어 있는 문제..(스코어는 없음) 때문에 코드 수정 -->
              <!-- <td v-for="(inning, i) in getLiveGame![idx].liveData.linescore.innings" :key="i">{{ inning.away.runs }}</td> -->
              <td v-for="(inning, i) in getLiveGame![idx].liveData.linescore.innings" :key="i">{{ inning.away.runs || '0' }}</td>
              <!-- <td v-if="!getLiveGame![idx].liveData.linescore.innings.length" v-for="(num, i) in 9" :key="i">{{ 0 }}</td> -->
              <!-- <template v-if="el.status.detailedState === 'Scheduled'"> -->
              <template v-if="getLiveGame![idx].liveData.linescore.innings.length < 9">
                <td v-for="(num, i) in (9 - getLiveGame![idx].liveData.linescore.innings.length)">{{ '' }}</td>
              </template>
              <td class="runs">{{ getLiveGame![idx].liveData.linescore.teams.away.runs || 0 }}</td>
              <td class="hits">{{ getLiveGame![idx].liveData.linescore.teams.away.hits || 0 }}</td>
              <td class="errors">{{ getLiveGame![idx].liveData.linescore.teams.away.errors || 0 }}</td>
            </tr>
            <tr>
              <th class="team">{{ getLiveGame![idx].gameData.teams.home.abbreviation }}</th>
              <!-- <td v-for="(inning, i) in getLiveGame![idx].liveData.linescore.innings" :key="i">{{ inning.home.runs }}</td> -->
              <!-- <td v-if="!getLiveGame![idx].liveData.linescore.innings.length" v-for="(num, i) in 9" :key="i">{{ 0 }}</td> -->
              <td v-for="(inning, i) in getLiveGame![idx].liveData.linescore.innings" :key="i">{{ inning.home.runs || 0 }}</td>
              <!-- <template v-if="el.status.detailedState === 'Scheduled'"> -->
              <template v-if="getLiveGame![idx].liveData.linescore.innings.length < 9">
                <td v-for="(num, i) in (9 - getLiveGame![idx].liveData.linescore.innings.length)">{{ '' }}</td>
              </template>
              <td class="runs">{{ getLiveGame![idx].liveData.linescore.teams.home.runs || 0 }}</td>
              <td class="hits">{{ getLiveGame![idx].liveData.linescore.teams.home.hits || 0 }}</td>
              <td class="errors">{{ getLiveGame![idx].liveData.linescore.teams.home.errors || 0 }}</td>
            </tr>
          </tbody>
        </table>
        </div> <!-- line score wrapper -->
      </div> <!-- line score -->
      <div class="box-score" v-if="getLiveGame && getLiveGame[idx] && getBoxScore && getBoxScore[idx]">
        <div class="box-score-table-container" v-for="(homeAway, index) in ['away', 'home']" :key="index">
          <div class="box-score-table-wrapper">
          <table class="box-score-table">
            <thead>
              <tr>
                <th class="player">Batters</th>
                <th>AB</th>
                <th>R</th>
                <th>H</th>
                <th>RBI</th>
                <th>BB</th>
                <th>K</th>
                <th>AVG</th>
                <th>OPS</th>
              </tr>
            </thead>
            <tbody v-for="(playerId, i) in getLiveGame![idx].liveData.boxscore.teams[homeAway].batters" :key="i">
              <tr v-if="getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].battingOrder">
                <th class="player">
                  <!-- <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].jerseyNumber }}</span> -->
                  <!-- 대타 들여쓰기 -->
                  <span v-if="getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].battingOrder[2] !== '0'">&nbsp;</span>
                  <!-- 이름 성만 표현 -->
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].person.fullName.substring(getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].person.fullName.indexOf(' ')) }}</span>
                  <span class="box-score-table position" v-for="(position, j) in getLiveGame[idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].allPositions" :key="j">
                    &nbsp;{{ position.abbreviation }}
                  </span>
                </th>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.batting.atBats }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.batting.runs }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.batting.hits }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.batting.rbi }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.batting.baseOnBalls }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.batting.strikeOuts }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].seasonStats.batting.avg }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].seasonStats.batting.ops }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <table class="box-score-table">
            <thead>
              <tr>
                <th class="player">Pitchers</th>
                <th>이닝</th>
                <th>피안타</th>
                <th>실점</th>
                <th>자책점</th>
                <th>볼넷</th>
                <th>삼진</th>
                <th>피홈런</th>
                <th>방어율</th>
              </tr>
            </thead>
            <tbody v-for="(playerId, i) in getLiveGame![idx].liveData.boxscore.teams[homeAway].pitchers" :key="i">
              <tr>
                <th class="player">
                  <!-- <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].jerseyNumber }}</span> -->
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].person.fullName.substring(getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].person.fullName.indexOf(' ')) }}</span>
                  <span class="record" v-if="getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.pitching.wins">&nbsp;W</span>
                  <span class="record" v-if="getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.pitching.losses">&nbsp;L</span>
                  <span class="record" v-if="getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.pitching.holds">&nbsp;H</span>
                  <span class="record" v-if="getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.pitching.saves">&nbsp;S</span>
                </th>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.pitching.inningsPitched }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.pitching.hits }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.pitching.runs }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.pitching.earnedRuns }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.pitching.baseOnBalls }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.pitching.strikeOuts }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].stats.pitching.homeRuns }}</span>
                </td>
                <td>
                  <span>{{ getLiveGame![idx].liveData.boxscore.teams[homeAway].players[`ID${playerId}`].seasonStats.pitching.era }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          </div> <!-- table wrapper -->
        </div> <!-- table container-->

        <!-- <div class="official">
          <span v-for="(official, i) in getBoxScore[idx].officials" :key="i">
            {{ official.officialType }} {{ official.official.fullName }}
          </span>
        </div>
        <div class="top-performer">
          <div v-for="(player, i) in getBoxScore[idx].topPerformers" :key="i">
            <p>{{ player.player.person.fullName }}</p>
            <div v-if="player.player.position.abbreviation === 'P'">
              {{ player.player.stats.pitching }}
            </div>
            <div v-else>
              {{ player.player.stats.batting }}
            </div>
          </div>
        </div> -->
      </div> <!-- box-score -->
    </div> <!-- total score board -->
  </div> <!--container-->
</template>
<style scoped>
  .schedule__game-info {
    display: grid;
    margin: 1rem 0;
    padding: 0.5rem 0;
    grid-template-columns: 1fr max-content 1fr;
    justify-content: center;
    align-items: center;
  }

  .schedule__game-info .team,
  .schedule__game-info .score {
    font-family: 'YEONGJUSeonbiTTF';
    font-weight: 900;
    font-size: 2rem;
  }

  .schedule__game-info .team {
    /* font-family: 'Trebuchet MS'; */
    font-family: 'WAGURITTF';
  }

  .schedule__game-info .mobile {
    display: none;
  }

  .box-score .official {
    font-size: 0.7rem;
  }

  .line-score {
    margin: 1rem auto;
  }

  .line-score-wrapper {
    overflow-x: auto;
  }

  .line-score-wrapper::-webkit-scrollbar {
    display: none;
  }

  .line-score-table {
    margin: 0 auto;
    /* border: 1px solid black; */
    width: 100%;
    max-width: 1080px;
    border-collapse: collapse;
  }

  .line-score-table thead {
    border-bottom: 1px solid #888;
  }

  .line-score-table .team {
    position: sticky;
    left: 0;
    padding: 5px;
    min-width: 4rem;
    background-color: white;
  }

  .line-score-table .team~th,
  .line-score-table .team~td {
    padding: 5px;
    min-width: 30px;
  }

  /* .line-score-table .innings, .line-score-table .runs,
  .line-score-table .hits, .line-score-table .errors {
    padding: 5px;
    min-width: 30px;
  } */

  .box-score-table-container {
    display: inline-block;
    vertical-align: top;
    width: 50%;
  }
  
  .box-score-table-wrapper {
    padding: 0 1.25rem;
  }

  .box-score-table {
    border-collapse: collapse;
    margin-bottom: 2rem;
    width: 100%;
    /* 줄 간격 조절 */
    line-height: 1.7rem;
  }

  .box-score-table thead {
    border-bottom: 1px solid #808080;
  }

  .box-score-table .position,
  .box-score-table .record {
    font-size: 0.75rem;
    color: #808080;
  }

  .box-score-table .player {
    text-align: left;
  }

  /* responsive mobile */
  @media (max-width: 568px) {
    .schedule__game-info .desktop {
      display: none;
    }

    .schedule__game-info .mobile {
      display: block;
    }

    .line-score-wrapper {
      margin: 0 auto;
      max-width: 80%;
    }

    .line-score-table thead {
      border-bottom: none;
      font-size: 12px;
    }

    .line-score-table .team {
      /* border-right: 1px solid rgb(221, 221, 221); */
    }

    /* 스크롤판 sticky 사용 위해서 거리 계산이 필요해 width 고정 */
    .line-score-table .team~th,
    .line-score-table .team~td {
      width: 30px;
    }

    /* 스코어판은 스크롤 안되고 먼저 보이도록 */
    .line-score-table .runs {
      position: sticky;
      right: 0;
      background-color: white;
    }

    .box-score-table-container {
      width: 100%;
    }
    /* margin으로 테이블 간격 조절 */
    table.box-score-table {
      margin-bottom: 1.25rem;
    }
    /* 패딩 상하로 옮기고 좌우 없애기 */
    .box-score-table-wrapper {
      padding: 1.25rem 0;
    }

    .box-score-table {
      font-size: 0.75rem;
    }

    .box-score-table td {
      font-size: 0.7rem;
      font-weight: 500;
    }
  }
</style>