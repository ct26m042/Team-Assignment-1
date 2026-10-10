import conferenceData from '../data/conference-data.json'

const sessionsById = new Map(conferenceData.sessions.map((session) => [session.id, session]))
const speakersById = new Map(conferenceData.speakers.map((speaker) => [speaker.id, speaker]))
const tracksById = new Map(conferenceData.tracks.map((track) => [track.id, track]))
const roomsById = new Map(conferenceData.rooms.map((room) => [room.id, room]))

export function useConferenceData() {
  return {
    conference: conferenceData.conference,
    tracks: conferenceData.tracks,
    rooms: conferenceData.rooms,
    speakers: conferenceData.speakers,
    sessions: conferenceData.sessions,
    sessionById: (id) => sessionsById.get(id),
    speakerById: (id) => speakersById.get(id),
    trackById: (id) => tracksById.get(id),
    roomById: (id) => roomsById.get(id),
  }
}
