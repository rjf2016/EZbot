type fakeTrack = {
  id: string
  title: string
  author: string
  source: string
  url: string
  thumbnail: string
  duration: string
  views: number
  requestedBy: string
  playlist: undefined
}

interface MockSearchResults {
  playlist: any
  tracks: fakeTrack[]
}

const mockSearchResults: MockSearchResults = {
  playlist: null,
  tracks: [
    {
      id: '1044833983524769792',
      title: '10 second chill music #7 | best to relax to!',
      author: 'progameing',
      url: 'https://www.youtube.com/watch?v=wN9bXy_fiOE',
      thumbnail: 'https://i3.ytimg.com/vi/wN9bXy_fiOE/maxresdefault.jpg',
      duration: '0:13',
      views: 1097729,
      requestedBy: '909319355265855528',
      playlist: undefined,
      source: 'youtube',
    },
    {
      id: '1044833983528964097',
      title: '10 second chill music #17 | Best One Yet!',
      author: 'progameing',
      url: 'https://www.youtube.com/watch?v=cBkNtO86_mY',
      thumbnail: 'https://i3.ytimg.com/vi/cBkNtO86_mY/maxresdefault.jpg',
      duration: '0:11',
      views: 119146,
      requestedBy: '909319355265855528',
      playlist: undefined,
      source: 'youtube',
    },
    {
      id: '1044833983528964098',
      title: '10 second chill music #18 | Best for chilling out',
      author: 'progameing',
      url: 'https://www.youtube.com/watch?v=pvk-WKCpfJM',
      thumbnail: 'https://i3.ytimg.com/vi/pvk-WKCpfJM/maxresdefault.jpg',
      duration: '0:12',
      views: 47062,
      requestedBy: '909319355265855528',
      playlist: undefined,
      source: 'youtube',
    },
    {
      id: '1044833983528964099',
      title: 'Chillout Lounge - Calm & Relaxing Background Music | Study, Work, Sleep, Meditation, Chill',
      author: 'The Good Life Radio x Sensual Musique',
      url: 'https://www.youtube.com/watch?v=9UMxZofMNbA',
      thumbnail: 'https://i3.ytimg.com/vi/9UMxZofMNbA/maxresdefault.jpg',
      duration: '0:00',
      views: 0,
      requestedBy: '909319355265855528',
      playlist: undefined,
      source: 'youtube',
    },
    {
      id: '1044833983528964100',
      title: '10 second chill music #15 | nice to relax too',
      author: 'progameing',
      url: 'https://www.youtube.com/watch?v=OwzEDDuR9RU',
      thumbnail: 'https://i3.ytimg.com/vi/OwzEDDuR9RU/maxresdefault.jpg',
      duration: '0:10',
      views: 74340,
      requestedBy: '909319355265855528',
      playlist: undefined,
      source: 'youtube',
    },
    {
      id: '1044833983528964101',
      title: '10 second chill music #10 | Best One Yet!',
      author: 'progameing',
      url: 'https://www.youtube.com/watch?v=PSfBqZ46NmE',
      thumbnail: 'https://i3.ytimg.com/vi/PSfBqZ46NmE/maxresdefault.jpg',
      duration: '0:11',
      views: 94992,
      requestedBy: '909319355265855528',
      playlist: undefined,
      source: 'youtube',
    },
    {
      id: '1044833983528964101',
      title: 'Some fake vidja',
      author: 'progameing',
      url: 'https://www.youtube.com/watch?v=Pfsdfafsdfo',
      thumbnail: 'https://i3.ytimg.com/vi/PSfBqZ46NmE/maxresdefault.jpg',
      duration: '0:11',
      views: 94992,
      requestedBy: '909319355265855528',
      playlist: undefined,
      source: 'youtube',
    },
    {
      id: '1044833983528964101',
      title: 'Another fake vidja',
      author: 'progameing',
      url: 'https://www.youtube.com/watch?v=PSfBqsdfssfd',
      thumbnail: 'https://i3.ytimg.com/vi/PSfBqZ46NmE/maxresdefault.jpg',
      duration: '0:11',
      views: 94992,
      requestedBy: '909319355265855528',
      playlist: undefined,
      source: 'youtube',
    },
    {
      id: '1044833983528964101',
      title: 'Last fake vidja',
      author: 'progameing',
      url: 'https://www.youtube.com/watch?v=PSffsdfsdffs',
      thumbnail: 'https://i3.ytimg.com/vi/PSfBqZ46NmE/maxresdefault.jpg',
      duration: '0:11',
      views: 94992,
      requestedBy: '909319355265855528',
      playlist: undefined,
      source: 'youtube',
    },
  ],
}

export default mockSearchResults
