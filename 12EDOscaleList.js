const scalesList = [
  {
    edo: 12,
    name: 'Dorian',
    steps: [2, 1, 2, 2, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Vietnamese ditonic',
    steps: [2, 10],
    aliases: []
  },
  {
    edo: 12,
    name: 'Honchoshi: Japan',
    steps: [5, 7],
    aliases: []
  },
  {
    edo: 12,
    name: 'Niagari: Japan',
    steps: [7, 5],
    aliases: []
  },
  {
    edo: 12,
    name: 'Warao ditonic: South America',
    steps: [10, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Vietnamese tritonic',
    steps: [3, 2, 7],
    aliases: []
  },
  {
    edo: 12,
    name: 'Ute tritonic',
    steps: [3, 4, 5],
    aliases: ['Peruvian tritonic 2']
  },
  {
    edo: 12,
    name: 'Raga Malasri',
    steps: [4, 3, 5],
    aliases: ['Peruvian tritonic 1']
  },
  {
    edo: 12,
    name: 'Raga Bilwadala',
    steps: [4, 5, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Sarvasri',
    steps: [5, 2, 5],
    aliases: ['Warao tritonic: South America']
  },
  {
    edo: 12,
    name: 'Sansagari: Japan',
    steps: [5, 5, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Ongkari',
    steps: [6, 1, 5],
    aliases: []
  },
  {
    edo: 12,
    name: 'Messiaen truncated mode 5',
    steps: [1, 5, 1, 5],
    aliases: []
  },
  {
    edo: 12,
    name: 'Messiaen truncated mode 5 inverse',
    steps: [5, 1, 5, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Messiaen truncated mode 6',
    steps: [2, 4, 2, 4],
    aliases: []
  },
  {
    edo: 12,
    name: 'Messiaen truncated mode 6 inverse',
    steps: [4, 2, 4, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Lavangi',
    steps: [1, 4, 3, 4],
    aliases: ['Gowleeswari']
  },
  {
    edo: 12,
    name: 'Warao tetratonic: South America',
    steps: [2, 1, 7, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Eskimo tetratonic (Alaska: Bethel)',
    steps: [2, 2, 3, 5],
    aliases: []
  },
  {
    edo: 12,
    name: 'Vietnamese tetratonic',
    steps: [3, 2, 2, 5],
    aliases: []
  },
  {
    edo: 12,
    name: 'Genus primum',
    steps: [2, 3, 2, 5],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Haripriya',
    steps: [2, 3, 3, 4],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Bhavani',
    steps: [2, 3, 4, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Sumukam',
    steps: [2, 4, 5, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Nigamagamini',
    steps: [4, 2, 5, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Mahathi',
    steps: [4, 3, 3, 2],
    aliases: ['Antara Kaishiaki']
  },
  {
    edo: 12,
    name: 'Bi Yu: China',
    steps: [3, 4, 3, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Genus primum inverse',
    steps: [5, 2, 3, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Han-kumoi: Japan',
    steps: [2, 3, 2, 1, 4],
    aliases: ['Raga Shobhavari', 'Sutradhari']
  },
  {
    edo: 12,
    name: 'Aeolian Pentatonic',
    steps: [2, 1, 4, 1, 4],
    aliases: ['Hira-joshi', 'Kata-kumoi', 'Yona Nuki Minor: Japan', 'Tizita Minor (Half tizita): Ethiopia']
  },
  {
    edo: 12,
    name: 'Anchi Hoye version 2: Ethiopia',
    steps: [1, 4, 1, 3, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Hon-kumoi-joshi',
    steps: [1, 4, 2, 1, 4],
    aliases: ['Sakura', 'Akebono II: Japan', 'Olympos Enharmonic', 'Raga Gunakri (Gunakali)', 'Latantapriya', 'Salanganata', 'Saveri', 'Ambassel: Ethiopia']
  },
  {
    edo: 12,
    name: 'Kokin-joshi',
    steps: [1, 4, 2, 3, 2],
    aliases: ['Miyakobushi', 'Han-Iwato', 'In Sen: Japan', 'Raga Bairagi', 'Lasaki', 'Vibhavari (Revati)']
  },
  {
    edo: 12,
    name: 'Iwato: Japan',
    steps: [1, 4, 1, 4, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Scottish Pentatonic',
    steps: [2, 3, 2, 2, 3],
    aliases: ['Blues Major', 'Ritusen', 'Ritsu (Gagaku): Japan', 'Zhi', 'Zheng: China', 'Ujo', 'P\'yongjo: Korea', 'Bac: Vietnam', 'Lai Soutsanaen', 'Lai Po Sai', 'Lai Soi: Laos', 'Raga Arabhi', 'Devakriya', 'Durga', 'Jaldhar Kedar', 'Suddha Saveri', 'Ambassel Major: Ethiopia', 'Major complement']
  },
  {
    edo: 12,
    name: 'Major Pentatonic',
    steps: [2, 2, 3, 2, 3],
    aliases: ['Ryosen', 'Yona Nuki Major: Japan', 'Man Jue', 'Gong: China', 'Raga Bhopali (Bhup)', 'Bilahari', 'Deskar', 'Kokila', 'Jait Kalyan', 'Mohanam', 'Peruvian Pentatonic 1', 'Ghana Pentatonic 2', 'Tizita Major: Ethiopia']
  },
  {
    edo: 12,
    name: 'Suspended Pentatonic',
    steps: [2, 3, 2, 3, 2],
    aliases: ['Raga Madhyamavati', 'Madhmat Sarang (Madhumad Sarang)', 'Megh', 'Egyptian', 'Shang', 'Rui Bin', 'Jin Yu', 'Qing Yu: China', 'Yo: Japan', 'Ngu Cung Dao: Vietnam', 'Yematebela wofe: Ethiopia']
  },
  {
    edo: 12,
    name: 'Chaio: China',
    steps: [2, 3, 3, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Kung: China',
    steps: [2, 2, 2, 3, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Altered Pentatonic',
    steps: [1, 4, 2, 2, 3],
    aliases: ['Raga Manaranjani II']
  },
  {
    edo: 12,
    name: 'Lydian Pentatonic',
    steps: [4, 2, 1, 4, 1],
    aliases: ['Raga Amritavarshini', 'Malashri', 'Shilangi', 'Bati Lydian: Ethiopia']
  },
  {
    edo: 12,
    name: 'Phrygian Pentatonic',
    steps: [1, 2, 4, 1, 4],
    aliases: ['Balinese Pelog', 'Madenda Modern', 'Raga Bhupalam', 'Bhupala Todi', 'Bibhas']
  },
  {
    edo: 12,
    name: 'Ionian Pentatonic',
    steps: [4, 1, 2, 4, 1],
    aliases: ['Raga Gambhiranata', 'Pelog Degung Modern', 'Ryukyu: Japan', 'Vong co: Vietnam', 'Bati Major: Ethiopia']
  },
  {
    edo: 12,
    name: 'Locrian Pentatonic 1',
    steps: [1, 2, 3, 2, 4],
    aliases: ['Raga Chhaya Todi']
  },
  {
    edo: 12,
    name: 'Minor Pentatonic',
    steps: [3, 2, 2, 3, 2],
    aliases: ['Blues Pentatonic', 'Raga Dhani (Suddha Dhanyasi)', 'Abheri', 'Udhayaravi Chandrika', 'Qing Shang', 'Gu Xian', 'Jia Zhong', 'Yu: China', 'P\'yongjo-kyemyonjo: Korea', 'Minyo: Japan', 'Lai Yai', 'Lai Noi: Laos', 'Nam', 'Northern Sa mac: Vietnam', 'Peruvian Pentatonic 2', 'Bati Minor: Ethiopia']
  },
  {
    edo: 12,
    name: 'Scriabin',
    steps: [1, 3, 3, 2, 3],
    aliases: ['Raga Dhanya Dhaivat', 'Jait', 'Rasika Ranjani', 'Vibhas (Marva)']
  },
  {
    edo: 12,
    name: 'Raga Abhogi',
    steps: [2, 1, 2, 4, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Amirkhani Kauns',
    steps: [4, 2, 1, 3, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Audav Tukhari',
    steps: [2, 1, 2, 3, 4],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Bhinna Shadja',
    steps: [4, 1, 4, 2, 1],
    aliases: ['Kaushikdhvani', 'Hindolita']
  },
  {
    edo: 12,
    name: 'Raga Bhupeshwari',
    steps: [2, 2, 3, 1, 4],
    aliases: ['Janasammodini']
  },
  {
    edo: 12,
    name: 'Raga Budhamanohari',
    steps: [2, 2, 1, 2, 5],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Marga Hindola',
    steps: [3, 2, 4, 2, 1],
    aliases: ['Rajeshwari']
  },
  {
    edo: 12,
    name: 'Raga Chandrakauns (Chandrakosh) (modern',
    steps: [3, 2, 3, 3, 1],
    aliases: ['Kiravani)']
  },
  {
    edo: 12,
    name: 'Raga Audav Bageshri',
    steps: [3, 2, 4, 1, 2],
    aliases: ['Chandrakauns (old', 'Kafi)', 'Sundarkauns', 'Surya', 'Varamu']
  },
  {
    edo: 12,
    name: 'Raga Chandraprabha',
    steps: [2, 3, 3, 3, 1],
    aliases: ['Priyadharshini']
  },
  {
    edo: 12,
    name: 'Raga Chitthakarshini',
    steps: [1, 2, 2, 3, 4],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Desh',
    steps: [2, 3, 2, 4, 1],
    aliases: ['Tcherepnin Major Pentatonic', 'Nam xuan: Vietnam']
  },
  {
    edo: 12,
    name: 'Raga Deshgaur (Desh Gaud)',
    steps: [1, 6, 1, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Devaranjani (Devaranji)',
    steps: [5, 2, 1, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Devshri',
    steps: [2, 4, 1, 3, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Dhavalashri',
    steps: [4, 2, 1, 2, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Gauri',
    steps: [1, 4, 2, 4, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Girija',
    steps: [4, 1, 3, 3, 1],
    aliases: ['Bacovia: Romania', 'Bati Major sharp 5: Ethiopia']
  },
  {
    edo: 12,
    name: 'Raga Guhamanohari',
    steps: [2, 3, 4, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Gyankali',
    steps: [1, 4, 3, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Hamsadhvani (Hansadhwani',
    steps: [2, 2, 3, 4, 1],
    aliases: ['Haunsdhwani)']
  },
  {
    edo: 12,
    name: 'Raga Harikauns',
    steps: [3, 3, 2, 2, 2],
    aliases: ['Tivrakauns', 'Chin: China']
  },
  {
    edo: 12,
    name: 'Raga Hindol (Sunada Vinodini)',
    steps: [4, 2, 3, 2, 1],
    aliases: ['Sanjh ka Hindol']
  },
  {
    edo: 12,
    name: 'Raga Jayakauns',
    steps: [3, 2, 1, 4, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Kalawati',
    steps: [4, 3, 2, 1, 2],
    aliases: ['Valaji']
  },
  {
    edo: 12,
    name: 'Raga Khamaji Durga',
    steps: [4, 1, 4, 1, 2],
    aliases: ['Rupeshwari']
  },
  {
    edo: 12,
    name: 'Raga Kokil Pancham',
    steps: [3, 2, 2, 1, 4],
    aliases: ['Blues Aeolian Pentatonic I']
  },
  {
    edo: 12,
    name: 'Raga Kshanika',
    steps: [1, 4, 3, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Kumarapriya',
    steps: [1, 1, 6, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Kumurdaki (Kumudaki)',
    steps: [2, 2, 2, 5, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Kuntvarali (Kuntalavarali)',
    steps: [5, 2, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Blues Minor',
    steps: [3, 2, 3, 2, 2],
    aliases: ['Raga Malkauns (Malakosh)', 'Raga Hindola', 'Man Gong', 'Quan Ming', 'Yi Ze', 'Jiao: China', 'Shegaye: Ethiopia']
  },
  {
    edo: 12,
    name: 'Raga Lilavati',
    steps: [3, 4, 2, 1, 2],
    aliases: ['Blues Dorian Pentatonic']
  },
  {
    edo: 12,
    name: 'Raga Mamata',
    steps: [4, 3, 2, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Manaranjani I',
    steps: [1, 3, 3, 3, 2],
    aliases: ['Sundarkali']
  },
  {
    edo: 12,
    name: 'Raga Matha Kokila (Matkokil)',
    steps: [2, 5, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Megharanjani',
    steps: [1, 3, 1, 3, 4],
    aliases: ['Syrian Pentatonic']
  },
  {
    edo: 12,
    name: 'Raga Megharanji (Megh Ranjani)',
    steps: [1, 3, 1, 6, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Mohanangi',
    steps: [3, 1, 3, 2, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Multani',
    steps: [3, 3, 1, 4, 1],
    aliases: ['Anchi Hoye version 1', 'Bati Minor sharp 4: Ethiopia']
  },
  {
    edo: 12,
    name: 'Raga Nabhomani',
    steps: [1, 1, 4, 1, 5],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Nagasvaravali (Naag Saravali)',
    steps: [4, 1, 2, 2, 3],
    aliases: ['Raga Mand', 'Bulgarian']
  },
  {
    edo: 12,
    name: 'Raga Nata',
    steps: [3, 2, 2, 4, 1],
    aliases: ['Udayaravicandrika', 'Madhuranjani']
  },
  {
    edo: 12,
    name: 'Raga Neroshta',
    steps: [2, 2, 5, 2, 1],
    aliases: ['Adbhut Kalyan']
  },
  {
    edo: 12,
    name: 'Raga Purnalalita',
    steps: [2, 1, 2, 2, 5],
    aliases: ['Chad Gadya (Khad Gadyo): Jewish', 'Ghana Pentatonic 1', 'Nando-kyemyonjo: Korea']
  },
  {
    edo: 12,
    name: 'Raga Puruhutika',
    steps: [5, 2, 2, 2, 1],
    aliases: ['Purvaholika']
  },
  {
    edo: 12,
    name: 'Raga Putrika',
    steps: [1, 1, 6, 1, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Rasranjani (Rasaranjani)',
    steps: [2, 3, 4, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Reva',
    steps: [1, 3, 3, 1, 4],
    aliases: ['Revagupti', 'Ramkali', 'Vibhas (Bhairava)']
  },
  {
    edo: 12,
    name: 'Raga Rukmangi',
    steps: [1, 2, 4, 3, 2],
    aliases: ['Bairagi Todi']
  },
  {
    edo: 12,
    name: 'Raga Samudhra Priya',
    steps: [3, 3, 1, 3, 2],
    aliases: ['Chandramadhu', 'Madhukauns (pentatonic)']
  },
  {
    edo: 12,
    name: 'Raga Saugandhini',
    steps: [1, 5, 1, 1, 4],
    aliases: ['Yashranjani']
  },
  {
    edo: 12,
    name: 'Raga Shailaja',
    steps: [3, 4, 1, 2, 2],
    aliases: ['Varini', 'Blues Aeolian Pentatonic II']
  },
  {
    edo: 12,
    name: 'Raga Shri Kalyan',
    steps: [2, 4, 1, 2, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Shubravarni',
    steps: [2, 4, 3, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Vaijayanti',
    steps: [2, 4, 1, 4, 1],
    aliases: ['Hamsanada']
  },
  {
    edo: 12,
    name: 'Raga Zilaf',
    steps: [4, 1, 2, 1, 4],
    aliases: []
  },
  {
    edo: 12,
    name: 'Dominant Pentatonic',
    steps: [2, 2, 3, 3, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Dorian Pentatonic',
    steps: [2, 1, 4, 2, 3],
    aliases: ['Raga Sivaranjini (Shivaranjani)', 'Akebono I: Japan']
  },
  {
    edo: 12,
    name: 'Mixolydian Pentatonic',
    steps: [4, 1, 2, 3, 2],
    aliases: ['Nam ai', 'Oan: Vietnam', 'Raga Savethri']
  },
  {
    edo: 12,
    name: 'Locrian Pentatonic 2',
    steps: [3, 1, 2, 4, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Minor added Sixth Pentatonic',
    steps: [3, 2, 2, 2, 3],
    aliases: ['Kyemyonjo: Korea']
  },
  {
    edo: 12,
    name: 'Whole-tone',
    steps: [2, 2, 2, 2, 2, 2],
    aliases: ['Messiaen mode 1', 'Raga Gopriya', 'Anhemitonic Hexatonic']
  },
  {
    edo: 12,
    name: 'Lydian Hexatonic',
    steps: [2, 2, 3, 2, 2, 1],
    aliases: ['Raga Kumud', 'Kesari Kalyan', 'Sankara (Shankara)', 'Prabhati']
  },
  {
    edo: 12,
    name: 'Mixolydian Hexatonic',
    steps: [2, 3, 2, 2, 1, 2],
    aliases: ['P\'yongjo: Korea', 'Yosen: Japan', 'Raga Darbar', 'Narayani', 'Suposhini', 'Andolika', 'Gorakh Kalyan', 'Durgawati', 'Rakta Hauns', 'Scottish gapped A scale']
  },
  {
    edo: 12,
    name: 'Phrygian Hexatonic',
    steps: [3, 2, 2, 1, 2, 2],
    aliases: ['Raga Desya Todi', 'Gopikavasantam (Gopika Basant)', 'Jayantasri', 'Pancham Malkauns']
  },
  {
    edo: 12,
    name: 'Arezzo Major Diatonic Hexachord',
    steps: [2, 2, 1, 2, 2, 3],
    aliases: ['Guidonian Hexachord', 'Scottish Hexatonic', 'Raga Kambhoji', 'Devarangini', 'Hem Kalyan', 'Pratapavarali', 'Sama (Syama)']
  },
  {
    edo: 12,
    name: 'Minor Hexatonic',
    steps: [2, 1, 2, 2, 3, 2],
    aliases: ['Raga Manirangu', 'Nayaki', 'Palasi', 'Pushpalithika (Puspalatika)', 'Suha Kanada', 'Nayaki Kanada', 'Gaudgiri Malhar', 'Suha Sughrai', 'Yo: Japan', 'Eskimo Hexatonic 1 (Alaska: King Island)']
  },
  {
    edo: 12,
    name: 'Locrian Hexatonic',
    steps: [1, 2, 2, 3, 2, 2],
    aliases: ['Ritsu: Japan', 'Raga Suddha Todi']
  },
  {
    edo: 12,
    name: 'Prometheus (Scriabin)',
    steps: [2, 2, 2, 3, 1, 2],
    aliases: ['Mystic', 'Raga Barbara']
  },
  {
    edo: 12,
    name: 'Prometheus Neapolitan',
    steps: [1, 3, 2, 3, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Blues scale I',
    steps: [3, 2, 1, 1, 3, 2],
    aliases: ['Raga Madhusurawali', 'Nileshwari']
  },
  {
    edo: 12,
    name: 'Blues Aeolian Hexatonic',
    steps: [3, 2, 1, 1, 1, 4],
    aliases: []
  },
  {
    edo: 12,
    name: 'Blues Minor Major 7',
    steps: [3, 2, 1, 1, 4, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Blues Pentachordal',
    steps: [2, 1, 2, 1, 1, 5],
    aliases: []
  },
  {
    edo: 12,
    name: 'Eskimo Hexatonic 2 (Alaska: Point Hope)',
    steps: [2, 2, 2, 2, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Hawaiian',
    steps: [2, 1, 4, 2, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Honchoshi plagal form: Japan',
    steps: [1, 2, 2, 1, 4, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Pyramid Hexatonic',
    steps: [2, 1, 2, 1, 3, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Istrian: Croatia',
    steps: [1, 2, 1, 2, 1, 5],
    aliases: []
  },
  {
    edo: 12,
    name: 'Double-Phrygian Hexatonic',
    steps: [1, 2, 2, 1, 3, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Lixian',
    steps: [1, 5, 2, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Schoenberg Signature Hexachord',
    steps: [1, 1, 3, 1, 3, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Glinka\'s Scale',
    steps: [2, 1, 2, 2, 1, 4],
    aliases: ['Raga Adi Bhairavi']
  },
  {
    edo: 12,
    name: 'Raga Amarasenapriya',
    steps: [2, 1, 3, 1, 4, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Bagesri',
    steps: [2, 1, 2, 4, 1, 2],
    aliases: ['Sriranjani', 'Kapijingla', 'Jayamanohari']
  },
  {
    edo: 12,
    name: 'Raga Bangal Bhairav',
    steps: [1, 3, 1, 2, 1, 4],
    aliases: ['Geyahejjajji', 'Kannadabangala', 'Malahari', 'Purna Pancama']
  },
  {
    edo: 12,
    name: 'Raga Bauli',
    steps: [1, 3, 3, 1, 3, 1],
    aliases: ['Prabhavati', 'Shreetank', 'Triveni']
  },
  {
    edo: 12,
    name: 'Raga Bhanumanjari',
    steps: [3, 1, 1, 2, 3, 2],
    aliases: ['Jog']
  },
  {
    edo: 12,
    name: 'Raga Bhavani',
    steps: [1, 2, 3, 2, 2, 2],
    aliases: ['Mangal Gujari']
  },
  {
    edo: 12,
    name: 'Raga Bhinna Pancama',
    steps: [2, 3, 2, 1, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Brindabani Sarang',
    steps: [2, 3, 2, 3, 1, 1],
    aliases: ['Megh (Megh Malhar)']
  },
  {
    edo: 12,
    name: 'Raga Caturangini',
    steps: [2, 2, 2, 1, 4, 1],
    aliases: ['Ratnakanthi']
  },
  {
    edo: 12,
    name: 'Raga Chandrajyoti',
    steps: [1, 1, 4, 1, 2, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Chandra Kalyan',
    steps: [1, 5, 1, 1, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Chandrika',
    steps: [2, 3, 2, 2, 2, 1],
    aliases: ['Nagagandhari']
  },
  {
    edo: 12,
    name: 'Raga Dhavalangam',
    steps: [1, 3, 2, 1, 1, 4],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Din ki Puriya',
    steps: [1, 3, 2, 2, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Dipak',
    steps: [2, 2, 1, 1, 1, 5],
    aliases: []
  },
  {
    edo: 12,
    name: 'Terpander Scale',
    steps: [1, 2, 2, 2, 3, 2],
    aliases: ['Raga Gandharavam', 'Sabai silt: Ethiopia']
  },
  {
    edo: 12,
    name: 'Raga Gaula (Gowlai)',
    steps: [1, 3, 1, 2, 4, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Ghantana',
    steps: [2, 1, 2, 3, 3, 1],
    aliases: ['Kaushiranjani (Kaishikiranjani)']
  },
  {
    edo: 12,
    name: 'Raga Gurjari Todi',
    steps: [1, 2, 3, 2, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Hamsanandi',
    steps: [1, 3, 2, 3, 2, 1],
    aliases: ['Marva', 'Pancama', 'Puriya', 'Sohni (Sohoni)']
  },
  {
    edo: 12,
    name: 'Raga Hamsa Vinodini',
    steps: [2, 2, 1, 4, 2, 1],
    aliases: ['Uday Ravi Chandrika']
  },
  {
    edo: 12,
    name: 'Raga Hari Nata',
    steps: [4, 1, 2, 2, 2, 1],
    aliases: ['Genus secundum']
  },
  {
    edo: 12,
    name: 'Raga Hejjajji',
    steps: [1, 3, 2, 2, 1, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Hemshri',
    steps: [3, 2, 2, 3, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Imratkauns',
    steps: [2, 2, 1, 3, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Jaganmohanam',
    steps: [2, 4, 1, 1, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Jait',
    steps: [1, 1, 2, 3, 2, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Jaiwanti',
    steps: [1, 2, 3, 1, 1, 4],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Janasamohini (Jansammohini)',
    steps: [2, 2, 3, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Jayant',
    steps: [3, 2, 2, 2, 1, 2],
    aliases: ['Malavasri', 'Manohari', 'Udan Chandrika', 'Blues Dorian Hexatonic']
  },
  {
    edo: 12,
    name: 'Raga Jivantika',
    steps: [1, 4, 2, 2, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Jivantini',
    steps: [3, 3, 1, 3, 1, 1],
    aliases: ['Gaurikriya']
  },
  {
    edo: 12,
    name: 'Raga Jogeshwari',
    steps: [3, 1, 1, 4, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Jyoti',
    steps: [4, 2, 1, 1, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Kalagada (Kalgada)',
    steps: [1, 3, 3, 1, 1, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Kalakanthi',
    steps: [1, 4, 2, 1, 1, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Kalavati',
    steps: [1, 3, 1, 2, 2, 3],
    aliases: ['Mangal Bhairav', 'Ragamalini']
  },
  {
    edo: 12,
    name: 'Raga Gangeshwari',
    steps: [4, 1, 2, 1, 2, 2],
    aliases: ['Kamal Manohari']
  },
  {
    edo: 12,
    name: 'Raga Kantal Varari',
    steps: [5, 2, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Kashyapi',
    steps: [1, 2, 4, 1, 2, 2],
    aliases: ['Saheli Todi']
  },
  {
    edo: 12,
    name: 'Raga Khamas',
    steps: [4, 1, 2, 2, 1, 2],
    aliases: ['Desya Khamas', 'Bahudari']
  },
  {
    edo: 12,
    name: 'Raga Kohal',
    steps: [2, 1, 4, 3, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Kolhaas',
    steps: [2, 1, 4, 2, 1, 2],
    aliases: ['Manavi']
  },
  {
    edo: 12,
    name: 'Raga Kumudvati',
    steps: [2, 3, 1, 1, 2, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Lagan Gandhar',
    steps: [2, 1, 1, 3, 2, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Lalita',
    steps: [1, 3, 1, 3, 3, 1],
    aliases: ['Sohini', 'Hamsanandi', 'Lalit Bhairav']
  },
  {
    edo: 12,
    name: 'Raga Latika',
    steps: [2, 2, 3, 1, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Madhukauns (hexatonic)',
    steps: [3, 3, 1, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Madhuradhwani',
    steps: [4, 1, 4, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Madhuranjani',
    steps: [2, 1, 2, 2, 4, 1],
    aliases: ['Rangeshwari', 'Sindhura Kafi', 'Blues Harmonic Hexatonic']
  },
  {
    edo: 12,
    name: 'Raga Madhurkauns',
    steps: [3, 1, 1, 3, 2, 2],
    aliases: ['Mohankauns']
  },
  {
    edo: 12,
    name: 'Raga Malarani',
    steps: [2, 4, 1, 3, 1, 1],
    aliases: ['Hamsanada']
  },
  {
    edo: 12,
    name: 'Raga Malayamarutham',
    steps: [1, 3, 3, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Malin',
    steps: [1, 3, 3, 2, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Mandari',
    steps: [1, 3, 2, 1, 4, 1],
    aliases: ['Gamakakriya', 'Hamsanarayani', 'Haunsnad', 'Koumari']
  },
  {
    edo: 12,
    name: 'Raga Mruganandana',
    steps: [2, 2, 2, 3, 2, 1],
    aliases: ['Raj Kalyan']
  },
  {
    edo: 12,
    name: 'Raga Nalinakanti',
    steps: [2, 2, 1, 2, 4, 1],
    aliases: ['Kedaram', 'Vilasini']
  },
  {
    edo: 12,
    name: 'Raga Navamanohari',
    steps: [2, 3, 2, 1, 2, 2],
    aliases: ['Shobhavari']
  },
  {
    edo: 12,
    name: 'Raga Neelangi',
    steps: [2, 1, 3, 2, 1, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Nishadi',
    steps: [2, 4, 1, 2, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Padi',
    steps: [1, 4, 2, 1, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Paraju (Paraz',
    steps: [4, 1, 2, 1, 3, 1],
    aliases: ['Pharas)', 'Ramamanohari', 'Sindhu Ramakriya', 'Kamalamanohari']
  },
  {
    edo: 12,
    name: 'Raga Parameshwari',
    steps: [1, 2, 2, 4, 1, 2],
    aliases: ['Deen Todi']
  },
  {
    edo: 12,
    name: 'Raga Phenadyuti',
    steps: [1, 4, 2, 1, 2, 2],
    aliases: ['Honchoshi', 'Insen', 'Niagari: Japan']
  },
  {
    edo: 12,
    name: 'Raga Rageshri (Rageshwari)',
    steps: [2, 2, 1, 4, 1, 2],
    aliases: ['Nattaikurinji (Natakuranji)']
  },
  {
    edo: 12,
    name: 'Raga Ranjani',
    steps: [2, 1, 3, 3, 2, 1],
    aliases: ['Rangini']
  },
  {
    edo: 12,
    name: 'Raga Ras Chandra',
    steps: [2, 2, 1, 1, 3, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Rasamanjari',
    steps: [3, 1, 2, 1, 4, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Rasavali',
    steps: [1, 4, 2, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Rudra Pancama',
    steps: [1, 3, 1, 4, 1, 2],
    aliases: ['Naat Kuranjika']
  },
  {
    edo: 12,
    name: 'Raga Saanjh Ki Hindol',
    steps: [4, 2, 3, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Salagavarali (Salag Varari)',
    steps: [1, 2, 4, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Sarasanana',
    steps: [2, 2, 1, 3, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Kameshwari',
    steps: [2, 4, 1, 2, 1, 2],
    aliases: ['Sarasvati']
  },
  {
    edo: 12,
    name: 'Raga Saravati (Sharavati)',
    steps: [4, 1, 2, 1, 1, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Shreevanti',
    steps: [1, 2, 3, 1, 4, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Simharava (Sinharavam)',
    steps: [2, 1, 3, 1, 3, 2],
    aliases: ['Gopikatilaka', 'Anil Madhyam']
  },
  {
    edo: 12,
    name: 'Raga Siva Kambhoji',
    steps: [2, 2, 1, 2, 3, 2],
    aliases: ['Vivardhini', 'Andhali']
  },
  {
    edo: 12,
    name: 'Raga Suddha Bangala',
    steps: [2, 1, 2, 2, 2, 3],
    aliases: ['Gauri Velavali', 'Pushp']
  },
  {
    edo: 12,
    name: 'Raga Suddha Mukhari',
    steps: [1, 1, 3, 3, 1, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Suddha Simantini',
    steps: [1, 2, 2, 2, 1, 4],
    aliases: ['Genus secundum inverse', 'Phrygian Hexamirror']
  },
  {
    edo: 12,
    name: 'Raga Syamalam',
    steps: [2, 1, 3, 1, 1, 4],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Takka',
    steps: [3, 2, 2, 1, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Tilang',
    steps: [4, 1, 2, 3, 1, 1],
    aliases: ['Savitri', 'Brindabani Tilang', 'Hauns Shree']
  },
  {
    edo: 12,
    name: 'Raga Trimurti',
    steps: [2, 1, 4, 1, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Tulsikauns',
    steps: [3, 2, 3, 2, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Udasi Bhairav',
    steps: [1, 3, 1, 1, 4, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Vasanta',
    steps: [1, 3, 1, 4, 2, 1],
    aliases: ['Chayavati']
  },
  {
    edo: 12,
    name: 'Raga Vasantabhairavi',
    steps: [1, 3, 1, 3, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Vijayanagari',
    steps: [2, 1, 3, 1, 2, 3],
    aliases: ['Shivawanti']
  },
  {
    edo: 12,
    name: 'Raga Vijayasri',
    steps: [1, 1, 4, 1, 4, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Vijayavasanta',
    steps: [4, 2, 1, 3, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Viyogavarali',
    steps: [1, 2, 2, 3, 3, 1],
    aliases: ['Antardhwani']
  },
  {
    edo: 12,
    name: 'Raga Vutari',
    steps: [4, 2, 1, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Yamuna Kalyani',
    steps: [2, 2, 2, 1, 2, 3],
    aliases: ['Kalyani Keseri', 'Airavati', 'Ancient Chinese']
  },
  {
    edo: 12,
    name: 'Messiaen mode 5',
    steps: [1, 1, 4, 1, 1, 4],
    aliases: ['Two-semitone Tritone scale']
  },
  {
    edo: 12,
    name: 'Messiaen mode 5 inverse',
    steps: [4, 1, 1, 4, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Messiaen truncated mode 3',
    steps: [1, 3, 1, 3, 1, 3],
    aliases: ['Hexatonic Set', 'Prometheus (Liszt)', 'Genus tertium inverse']
  },
  {
    edo: 12,
    name: 'Messiaen truncated mode 3 inverse',
    steps: [3, 1, 3, 1, 3, 1],
    aliases: ['Major Augmented', 'Genus tertium', 'Raga Devamani']
  },
  {
    edo: 12,
    name: 'Messiaen truncated mode 2',
    steps: [1, 2, 3, 1, 2, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Messiaen truncated mode 2',
    steps: [1, 3, 2, 1, 3, 2],
    aliases: ['Raga Indupriya', 'Tritone scale']
  },
  {
    edo: 12,
    name: 'Equal temperaments 3 and 4 mixed',
    steps: [3, 1, 2, 2, 1, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Superlocrian Hexamirror',
    steps: [1, 2, 1, 2, 4, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Takemitsu Tree Line mode 1',
    steps: [2, 1, 3, 2, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Takemitsu Tree Line mode 2',
    steps: [2, 1, 3, 2, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Locrian', 
    steps: [1, 2, 2, 1, 2, 2, 2],
    aliases: ['M.Locrian', 'G.Mixolydian', 'G.Hyperdorian', 'M.Hypophrygian', 'G.M.Hyperaeolian', 'Rut biscale descending', 'Pien chih: China', 'Makam Lami', 'Raga Meladalan', 'Yishtabach: Jewish']
  },
  {
    edo: 12,
    name: 'Ionian (Major)', 
    steps: [2, 2, 1, 2, 2, 2, 1],
    aliases: ['G.Lydian', 'M.Hypolydian', 'Major', 'Bilaval That', 'Mela Shankarabharanam', 'Raga Atana', 'Begada', 'Kathanakuthuhalam', 'Ghana Heptatonic', 'Peruvian Major', 'Matzore', 'Rast ascending: Greece', '4th plagal Byzantine', 'Ararai: Ethiopia', 'Makam Cargah', 'Ajam Ashiran', 'Dastgah-e Mahur', 'Dastgah-e Rast Panjgah', 'Xin: China', 'DS2', 'Heptatonia prima']
  },
  {
    edo: 12,
    name: 'Dorian', 
    steps: [2, 1, 2, 2, 2, 1, 2],
    aliases: ['M.Dorian', 'G.Phrygian', 'M.Hypomixolydian', 'G.M.Hypoionian (Hypoiastian)', 'Kafi That', 'Mela Kharaharapriya', 'Raga Bageshri', 'Bhimpalasi', 'Dhanasri', 'Huseni', 'Kanara', 'Kannada Gowlai', 'Kapi', 'Nayaki Kanada', 'Raisa Kanada', 'Ritigaula', 'Shahana', 'Sriraga', 'Mischung 5', 'Gregorian nr.8', 'Eskimo Heptatonic', 'Yu: China', 'Hyojo', 'Oshikicho', 'Banshikicho: Japan', 'Nam: Vietnam']
  },
  {
    edo: 12,
    name: 'Phrygian', 
    steps: [1, 2, 2, 2, 1, 2, 2],
    aliases: ['M.Phrygian', 'G.Dorian', 'G.M.Hypoaeolian', 'Bhairavi That', 'Mela Hanumatodi', 'Raga Asavari (Asaveri)', 'Bilashkhani Todi', 'Darjeeling', 'Ghanta', 'Makam Kurd', 'Gregorian nr.3', 'Escala Andaluza', 'In', 'Zokuso: Japan', 'Ousak: Greece', 'Major inverse']
  },
  {
    edo: 12,
    name: 'Lydian', 
    steps: [2, 2, 2, 1, 2, 2, 1],
    aliases: ['M.Lydian', 'G.Hypolydian', 'G.M.Hypolocrian', 'Rut biscale ascending', 'Kalyan That (Yaman)', 'Mela Mecakalyani', 'Raga Chandrakant', 'Malarani', 'Shuddh Kalyan', 'Ping', 'Kung', 'Gu: China']
  },
  {
    edo: 12,
    name: 'Mixolydian', 
    steps: [2, 2, 1, 2, 2, 1, 2],
    aliases: ['M.Mixolydian', 'G.Hypophrygian', 'G.Ionian (Iastian)', 'G.M.Hypoionian', 'Hypermixolydian', 'Mischung 3', 'Khamaj That', 'Mela Harikambhoji', 'Raga Balahamsa', 'Bhim', 'Devamanohari', 'Gaoti', 'Harini', 'Janjhuti', 'Kaamaai', 'Kalashri', 'Khambhavati', 'Sahana', 'Sakh', 'Surati', 'Gregorian nr.7', 'Enharmonic Byzantine Liturgical', 'Rast descending: Greece', 'Ching', 'Shang: China']
  },
  {
    edo: 12,
    name: 'Aeolian (Natural Minor)', 
    steps: [2, 1, 2, 2, 1, 2, 2],
    aliases: ['G.M.Aeolian', 'G.M.Hypodorian', 'G.Hyperphrygian', 'Natural Minor', 'Melodic Minor descending', 'Asavari That', 'Mela Natabhairavi', 'Raga Jaunpuri', 'Adana', 'Darbari', 'Dhanyasi', 'Jingla', 'Sampurna Malkauns', 'Gregorian nr.2', 'Makam Buselik', 'Nihavend', 'Peruvian Minor', 'Se', 'Chiao: China', 'Geez', 'Ezel: Ethiopia', 'Kiourdi descending: Greece', 'Cushak: Armenia']
  },
  {
    edo: 12,
    name: 'Chromatic Mixolydian',
    steps: [1, 1, 3, 1, 1, 3, 2],
    aliases: ['Raga Madhusurja']
  },
  {
    edo: 12,
    name: 'Chromatic Lydian',
    steps: [1, 3, 1, 1, 3, 2, 1],
    aliases: ['Raga Lalit', 'Bhankar', 'Lalita Sohini', 'Malti Basant', 'Pancham', 'Sohini Pancham', 'Suddha Basant']
  },
  {
    edo: 12,
    name: 'Chromatic Phrygian',
    steps: [3, 1, 1, 3, 2, 1, 1],
    aliases: ['Raga Ek Prakar ki Kauns']
  },
  {
    edo: 12,
    name: 'Chromatic Dorian',
    steps: [1, 1, 3, 2, 1, 1, 3],
    aliases: ['Mela Kanakangi', 'Raga Kanakambari']
  },
  {
    edo: 12,
    name: 'Chromatic Hypolydian',
    steps: [1, 3, 2, 1, 1, 3, 1],
    aliases: ['Purvi (Poorvi) That', 'Mela Kamavardhani', 'Raga Shri', 'Basant', 'Gauri Basant', 'Dhipaka', 'Pantuvarali', 'Jaitashree', 'Kasiramakriya', 'Maligaura (Maligoura)', 'Puriya Dhanashri', 'Suddharamakriya', 'Tanki (Tankeshree)', 'Pireotikos: Greece']
  },
  {
    edo: 12,
    name: 'Chromatic Hypophrygian',
    steps: [3, 2, 1, 1, 3, 1, 1],
    aliases: ['Blues scale III']
  },
  {
    edo: 12,
    name: 'Chromatic Hypodorian',
    steps: [2, 1, 1, 3, 1, 1, 3],
    aliases: ['Relative Blues scale', 'Raga Dvigandharabushini']
  },
  {
    edo: 12,
    name: 'Chromatic Mixolydian inverse',
    steps: [2, 3, 1, 1, 3, 1, 1],
    aliases: ['Raga Loom Sarang']
  },
  {
    edo: 12,
    name: 'Chromatic Phrygian inverse',
    steps: [1, 1, 2, 3, 1, 1, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Chromatic Hypophrygian inverse',
    steps: [1, 1, 3, 1, 1, 2, 3],
    aliases: ['Phrygian Hungarian Minor']
  },
  {
    edo: 12,
    name: 'Chromatic Hypodorian inverse',
    steps: [3, 1, 1, 3, 1, 1, 2],
    aliases: ['Raga Amrut Ranjani']
  },
  {
    edo: 12,
    name: 'Melodic Minor ascending',
    steps: [2, 1, 2, 2, 2, 2, 1],
    aliases: ['Jazz Minor', 'Minor-Major', 'Dorian sharp 7', 'Mela Gaurimanohari', 'Raga Kedar Bahar', 'Patdip (Patadeep)', 'Velavali', 'Deshi(2)', 'Mischung 1', 'Hawaiian']
  },
  {
    edo: 12,
    name: 'Harmonic Minor',
    steps: [2, 1, 2, 2, 1, 3, 1],
    aliases: ['Mischung 4', 'Pilu That', 'Mela Kiravani', 'Raga Kiranavali', 'Kirvani (Kirwani)', 'Kalyana Vasantha', 'Deshi(3)', 'Maqam Bayat-e-Esfahan', 'Sultani Yakah', 'Zhalibny Minor', 'Armoniko minore: Greece']
  },
  {
    edo: 12,
    name: 'Harmonic Minor inverse',
    steps: [1, 3, 1, 2, 2, 1, 2],
    aliases: ['Mixolydian flat 2', 'Mela Cakravaka', 'Raga Ahir Bhairav', 'Bindumalini', 'Hevitri', 'Vegavahini', 'Makam Hicaz', 'Zanjaran']
  },
  {
    edo: 12,
    name: 'Harmonic Major',
    steps: [2, 2, 1, 2, 1, 3, 1],
    aliases: ['Mischung 2', 'Mela Sarasangi', 'Raga Anand Leela', 'Haripriya', 'Nat Bhairav', 'Simhavahini', 'Ethiopian', 'Tabahaniotikos: Greece']
  },
  {
    edo: 12,
    name: 'Makam Huzzam',
    steps: [1, 2, 1, 3, 1, 2, 2],
    aliases: ['Maqam Saba Zamzam', 'Phrygian flat 4']
  },
  {
    edo: 12,
    name: 'Ionian Augmented',
    steps: [2, 2, 1, 3, 1, 2, 1],
    aliases: ['Ionian sharp 5']
  },
  {
    edo: 12,
    name: 'Lydian Augmented',
    steps: [2, 2, 2, 2, 1, 2, 1],
    aliases: ['Lydian sharp 5']
  },
  {
    edo: 12,
    name: 'Locrian natural 6',
    steps: [1, 2, 2, 1, 3, 1, 2],
    aliases: ['Maqam Tarznauyn', 'Raga Laliteshwari']
  },
  {
    edo: 12,
    name: 'Major Locrian',
    steps: [2, 2, 1, 1, 2, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Minor Locrian',
    steps: [2, 1, 2, 1, 2, 2, 2],
    aliases: ['Semilocrian', 'Half Diminished', 'Locrian sharp 2', 'Minor flat 5']
  },
  {
    edo: 12,
    name: 'Superlocrian',
    steps: [1, 2, 1, 2, 2, 2, 2],
    aliases: ['Altered Dominant', 'Diminished Whole-tone', 'Locrian flat 4', 'Pomeroy', 'Ravel', 'Raga Faridi Todi']
  },
  {
    edo: 12,
    name: 'Locrian nr.2',
    steps: [2, 1, 2, 1, 2, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Ultralocrian',
    steps: [1, 2, 1, 2, 2, 1, 3],
    aliases: ['Superlocrian Diminished', 'Mixolydian sharp 1', 'Altered Diminished 7']
  },
  {
    edo: 12,
    name: 'Locrian double-flat 7',
    steps: [1, 2, 2, 1, 2, 1, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Nohkan Flute scale: Japan',
    steps: [2, 3, 1, 2, 1, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Sabach (Sambah) ascending: Greece',
    steps: [2, 1, 1, 3, 1, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Dorian flat 5',
    steps: [2, 1, 2, 1, 3, 1, 2],
    aliases: ['Blues Heptatonic', 'Makam Karcigar', 'Maqam Nahawand Murassah', 'Kiourdi ascending', 'Kartzihiar: Greece']
  },
  {
    edo: 12,
    name: 'Blues Heptatonic II',
    steps: [3, 2, 1, 1, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Blues Harmonic Heptatonic',
    steps: [3, 2, 1, 1, 1, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Jeths\' mode',
    steps: [2, 1, 2, 1, 3, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Triadic Heptatonic 29',
    steps: [1, 1, 2, 2, 1, 2, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Mela Ratnangi',
    steps: [1, 1, 3, 2, 1, 2, 2],
    aliases: ['Raga Phenadyuti']
  },
  {
    edo: 12,
    name: 'Mela Ganamurti',
    steps: [1, 1, 3, 2, 1, 3, 1],
    aliases: ['Raga Ganasamavarali']
  },
  {
    edo: 12,
    name: 'Mela Vanaspati',
    steps: [1, 1, 3, 2, 2, 1, 2],
    aliases: ['Raga Bhanumati']
  },
  {
    edo: 12,
    name: 'Mela Manavati',
    steps: [1, 1, 3, 2, 2, 2, 1],
    aliases: ['Raga Manoranjani']
  },
  {
    edo: 12,
    name: 'Mela Tanarupi',
    steps: [1, 1, 3, 2, 3, 1, 1],
    aliases: ['Raga Tanukirti']
  },
  {
    edo: 12,
    name: 'Mela Senavati',
    steps: [1, 2, 2, 2, 1, 1, 3],
    aliases: ['Raga Senagrani', 'Malini']
  },
  {
    edo: 12,
    name: 'Neapolitan Minor',
    steps: [1, 2, 2, 2, 1, 3, 1],
    aliases: ['Hungarian Gipsy', 'Mela Dhenuka', 'Raga Bhinnasadjam', 'Dhunibinnashadjam', 'Kirvanti', 'Takka', 'Maqam Shahnaz Kurdi']
  },
  {
    edo: 12,
    name: 'Neapolitan Major',
    steps: [1, 2, 2, 2, 2, 2, 1],
    aliases: ['Lydian Major', 'Mela Kokilapriya', 'Raga Kokilaravam', 'Heptatonia tertia']
  },
  {
    edo: 12,
    name: 'Mela Natakapriya',
    steps: [1, 2, 2, 2, 2, 1, 2],
    aliases: ['Jazz Minor inverse', 'Phrygian-Mixolydian', 'Dorian flat 2', 'Phrygian sharp 6', 'Raga Ahiri Todi', 'Jaiwanti Todi', 'Natabharanam', 'Motaki', 'Prabhateshwari']
  },
  {
    edo: 12,
    name: 'Mela Rupavati',
    steps: [1, 2, 2, 2, 3, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Lalita',
    steps: [1, 3, 1, 1, 2, 3, 1],
    aliases: ['Persian', 'Chromatic Hypolydian inverse', 'Raga Suddha Pancama']
  },
  {
    edo: 12,
    name: 'Mela Gayakapriya',
    steps: [1, 3, 1, 2, 1, 1, 3],
    aliases: ['Raga Kalakanti', 'Gipsy Hexatonic']
  },
  {
    edo: 12,
    name: 'Phrygian Dominant',
    steps: [1, 3, 1, 2, 1, 2, 2],
    aliases: ['Phrygian Major', 'Mela Vakulabharanam', 'Raga Ahiri', 'Basant Mukhari', 'Jogiya', 'Prabhakali', 'Vativasantabhairavi', 'Zilof', 'Ahava rabbah', 'Freygish: Jewish', 'Maqam Hijaz-Nahawand', 'Humayun', 'Spanish Gipsy', 'Dorico Flamenco', 'Frigio Flamenco: Spain', 'Hitzaz: Greece', 'Harmonic Major inverse', 'Mixolydian flat 2 flat 6']
  },
  {
    edo: 12,
    name: 'Double Harmonic Major',
    steps: [1, 3, 1, 2, 1, 3, 1],
    aliases: ['Major Gipsy', 'Bhairav That', 'Mela Mayamalavagaula', 'Raga Paraj', 'Kalingada (Kalingda)', 'Gaulipantu', 'Lalitapancamam', 'Gandhakriya', 'Manjiri', 'Chromatic 2nd Byzantine Liturgical', 'Hitzazkiar: Greece', 'Maqam Zengule', 'Hijaz Kar', 'Suzidil']
  },
  {
    edo: 12,
    name: 'Mela Suryakanta',
    steps: [1, 3, 1, 2, 2, 2, 1],
    aliases: ['Bhairubahar That', 'Raga Supradhipam', 'Sowrashtram (Sourashtra)', 'Jaganmohini', 'Bhatiyari Bhairav', 'Dakshinatya Basant', 'Major-Melodic Phrygian', 'Hungarian Gipsy inverse']
  },
  {
    edo: 12,
    name: 'Mela Hatakambari',
    steps: [1, 3, 1, 2, 3, 1, 1],
    aliases: ['Raga Jeyasuddhamalavi']
  },
  {
    edo: 12,
    name: 'Modified Blues',
    steps: [2, 1, 2, 1, 1, 3, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Mela Jhankaradhvani',
    steps: [2, 1, 2, 2, 1, 1, 3],
    aliases: ['Raga Jhankara Bhramavi']
  },
  {
    edo: 12,
    name: 'Mela Varunapriya',
    steps: [2, 1, 2, 2, 3, 1, 1],
    aliases: ['Viravasantham', 'Raga Daulati', 'Dev Sakh (Deshakya)', 'Nanak Malhar']
  },
  {
    edo: 12,
    name: 'Mela Mararanjani',
    steps: [2, 2, 1, 2, 1, 1, 3],
    aliases: ['Raga Keseri', 'Major Bebop Heptatonic']
  },
  {
    edo: 12,
    name: 'Major-Minor',
    steps: [2, 2, 1, 2, 1, 2, 2],
    aliases: ['Melodic Major', 'Mischung 6', 'Mixolydian flat 6', 'Arabic Minor', 'Oriental Minor', 'Mela Carukesi', 'Raga Charukeshi', 'Malayalam', 'Tarangini', 'Heptatonia secunda']
  },
  {
    edo: 12,
    name: 'Mela Naganandini',
    steps: [2, 2, 1, 2, 3, 1, 1],
    aliases: ['Raga Badhans Sarang', 'Nagabharanam', 'Nupur', 'Samanta']
  },
  {
    edo: 12,
    name: 'Mela Yagapriya',
    steps: [3, 1, 1, 2, 1, 1, 3],
    aliases: ['Raga Kalahamsa']
  },
  {
    edo: 12,
    name: 'Mela Ragavardhani',
    steps: [3, 1, 1, 2, 1, 2, 2],
    aliases: ['Raga Cudamani', 'Vardhini']
  },
  {
    edo: 12,
    name: 'Mela Gangeyabhusani',
    steps: [3, 1, 1, 2, 1, 3, 1],
    aliases: ['Raga Gangatarangini', 'Sengiach (Sengah): Greece', 'Gipsy Hexatonic inverse']
  },
  {
    edo: 12,
    name: 'Mela Vagadhisvari',
    steps: [3, 1, 1, 2, 2, 1, 2],
    aliases: ['Raga Bhogachayanata', 'Chayanata', 'Ganavaridhi', 'Jogeshwari Pancham', 'Nandkauns', 'Bluesy Rock \'n Roll']
  },
  {
    edo: 12,
    name: 'Mela Sulini',
    steps: [3, 1, 1, 2, 2, 2, 1],
    aliases: ['Raga Sailadesakshi', 'Raga Trishuli', 'Houzam: Greece']
  },
  {
    edo: 12,
    name: 'Mela Calanata',
    steps: [3, 1, 1, 2, 3, 1, 1],
    aliases: ['Raga Dogaha', 'None', 'Chromatic Dorian inverse']
  },
  {
    edo: 12,
    name: 'Mela Salaga',
    steps: [1, 1, 4, 1, 1, 1, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Mela Jalarnava',
    steps: [1, 1, 4, 1, 1, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Mela Jhalavarali',
    steps: [1, 1, 4, 1, 1, 3, 1],
    aliases: ['Raga Varali', 'Jinavali']
  },
  {
    edo: 12,
    name: 'Mela Navanitam',
    steps: [1, 1, 4, 1, 2, 1, 2],
    aliases: ['Raga Nabhomani']
  },
  {
    edo: 12,
    name: 'Mela Pavani',
    steps: [1, 1, 4, 1, 2, 2, 1],
    aliases: ['Raga Kumbhini']
  },
  {
    edo: 12,
    name: 'Mela Raghupriya',
    steps: [1, 1, 4, 1, 3, 1, 1],
    aliases: ['Raga Ravikriya', 'Ghandarva']
  },
  {
    edo: 12,
    name: 'Mela Gavambodhi',
    steps: [1, 2, 3, 1, 1, 1, 3],
    aliases: ['Raga Girvani']
  },
  {
    edo: 12,
    name: 'Mela Bhavapriya',
    steps: [1, 2, 3, 1, 1, 2, 2],
    aliases: ['Raga Bhavani', 'Kalamurti', 'Neveseri ascending: Greece']
  },
  {
    edo: 12,
    name: 'Todi That',
    steps: [1, 2, 3, 1, 1, 3, 1],
    aliases: ['Mela Shubhapantuvarali', 'Raga Annapurna', 'Gamakasamantam', 'Hemavanti', 'Kaam Ranjani', 'Multani', 'Harsh Minor', 'Chromatic Lydian inverse', 'Maqam Athar Kurd']
  },
  {
    edo: 12,
    name: 'Mela Sadvidhamargini',
    steps: [1, 2, 3, 1, 2, 1, 2],
    aliases: ['Raga Sthavarajam', 'Tivravahini']
  },
  {
    edo: 12,
    name: 'Mela Suvarnangi',
    steps: [1, 2, 3, 1, 2, 2, 1],
    aliases: ['Raga Sauviram']
  },
  {
    edo: 12,
    name: 'Mela Divyamani',
    steps: [1, 2, 3, 1, 3, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Mela Dhavalambari',
    steps: [1, 3, 2, 1, 1, 1, 3],
    aliases: ['Raga Dhavalangam', 'Foulds\' Mantra of Will scale']
  },
  {
    edo: 12,
    name: 'Mela Namanarayani',
    steps: [1, 3, 2, 1, 1, 2, 2],
    aliases: ['Raga Narmada', 'Pratapa', 'Harsh Major-Minor', 'Mixolydian flat 2 sharp 4 flat 6']
  },
  {
    edo: 12,
    name: 'Romanian Major',
    steps: [1, 3, 2, 1, 2, 1, 2],
    aliases: ['Mela Ramapriya', 'Raga Basant Bahar', 'Ramamanohari', 'Rampriya', 'Petrushka chord', 'Mixolydian flat 2 sharp 4']
  },
  {
    edo: 12,
    name: 'Marva That',
    steps: [1, 3, 2, 1, 2, 2, 1],
    aliases: ['Mela Gamanasrama', 'Raga Bairari (Baradi)', 'Malavi', 'Partiravam', 'Puriya', 'Puriya Kalyan', 'Purva', 'Purvikalyani', 'Sohani', 'Harsh-intense Major', 'Peiraiotikos: Greece']
  },
  {
    edo: 12,
    name: 'Mela Visvambhari',
    steps: [1, 3, 2, 1, 3, 1, 1],
    aliases: ['Raga Vamsavathi']
  },
  {
    edo: 12,
    name: 'Verdi\'s Scala enigmatica ascending',
    steps: [1, 3, 2, 2, 2, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Verdi\'s Scala enigmatica descending',
    steps: [1, 3, 1, 3, 2, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Moravian Pistalkova',
    steps: [2, 1, 2, 1, 2, 1, 3],
    aliases: ['Hungarian Major inverse']
  },
  {
    edo: 12,
    name: 'Minor Gipsy',
    steps: [2, 1, 3, 1, 1, 2, 2],
    aliases: ['Mela Sanmukhapriya', 'Raga Camara', 'Chinthamani']
  },
  {
    edo: 12,
    name: 'Double Harmonic Minor',
    steps: [2, 1, 3, 1, 1, 3, 1],
    aliases: ['Hungarian Minor', 'Egyptian Heptatonic', 'Mela Simhendramadhyama', 'Raga Madhava Manohari', 'Shimendra Madyam', 'Maqam Nawa Athar', 'Hisar', 'Flamenco Mode', 'Niavent: Greece']
  },
  {
    edo: 12,
    name: 'Mela Hemavati',
    steps: [2, 1, 3, 1, 2, 1, 2],
    aliases: ['Raga Desisimharavam', 'Madhukant', 'Maqam Nakriz', 'Tunisian', 'Dorian sharp 4', 'Misheberekh: Jewish', 'Nigriz', 'Pimenikos', 'Souzinak (Peiraiotikos Minor): Greece', 'Ukrainian Dorian', 'Ukrainian Minor', 'Kaffa', 'Gnossiennes']
  },
  {
    edo: 12,
    name: 'Lydian Diminished',
    steps: [2, 1, 3, 1, 2, 2, 1],
    aliases: ['Mela Dharmavati', 'Raga Ambika', 'Anjani Kalyan', 'Arunajualita', 'Dumyaraga', 'Madhuvanti']
  },
  {
    edo: 12,
    name: 'Minor Gipsy inverse',
    steps: [2, 2, 1, 1, 3, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Lydian Minor',
    steps: [2, 2, 2, 1, 1, 2, 2],
    aliases: ['Mela Rishabhapriya', 'Raga Ratipriya', 'Mixolydian sharp 4 flat 6']
  },
  {
    edo: 12,
    name: 'Harmonic Lydian',
    steps: [2, 2, 2, 1, 1, 3, 1],
    aliases: ['Mela Latangi', 'Raga Gitapriya', 'Hamsalata']
  },
  {
    edo: 12,
    name: 'Lydian Dominant',
    steps: [2, 2, 2, 1, 2, 1, 2],
    aliases: ['Mela Vacaspati', 'Raga Bhusavati', 'Bhusavali', 'Vachaspati', 'Overtone', 'Lydian-Mixolydian', 'Bartok']
  },
  {
    edo: 12,
    name: 'Hungarian Major',
    steps: [3, 1, 2, 1, 2, 1, 2],
    aliases: ['Mela Nasikabhusani', 'Raga Nasamani']
  },
  {
    edo: 12,
    name: 'Aeolian Harmonic',
    steps: [3, 1, 2, 1, 2, 2, 1],
    aliases: ['Lydian sharp 2', 'Mela Kosalam', 'Raga Kusumakaram', 'Sampoorna Hindol']
  },
  {
    edo: 12,
    name: 'Aeolian flat 1',
    steps: [3, 1, 2, 2, 1, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Mela Citrambari',
    steps: [2, 2, 2, 1, 3, 1, 1],
    aliases: ['Raga Chaturangini']
  },
  {
    edo: 12,
    name: 'Mela Dhatuvardhani',
    steps: [3, 1, 2, 1, 1, 3, 1],
    aliases: ['Raga Dhauta Pancama', 'Devarashtra']
  },
  {
    edo: 12,
    name: 'Mela Jyotisvarupini',
    steps: [3, 1, 2, 1, 1, 2, 2],
    aliases: ['Raga Jotismatti']
  },
  {
    edo: 12,
    name: 'Mela Kantamani',
    steps: [2, 2, 2, 1, 1, 1, 3],
    aliases: ['Raga Kuntala', 'Srutiranjani']
  },
  {
    edo: 12,
    name: 'Mela Nitimati',
    steps: [2, 1, 3, 1, 3, 1, 1],
    aliases: ['Raga Nisada', 'Kaikavasi']
  },
  {
    edo: 12,
    name: 'Mela Rasikapriya',
    steps: [3, 1, 2, 1, 3, 1, 1],
    aliases: ['Raga Rasamanjari', 'Hamsagiri']
  },
  {
    edo: 12,
    name: 'Mela Sucaritra',
    steps: [3, 1, 2, 1, 1, 1, 3],
    aliases: ['Raga Santanamanjari']
  },
  {
    edo: 12,
    name: 'Mela Syamalangi',
    steps: [2, 1, 3, 1, 1, 1, 3],
    aliases: ['Raga Shyamalam', 'Vijay']
  },
  {
    edo: 12,
    name: 'Raga Chandni Kedar',
    steps: [2, 3, 1, 1, 2, 2, 1],
    aliases: ['Jairaj', 'Noor Sarang', 'Suddha Sarang']
  },
  {
    edo: 12,
    name: 'Raga Hindol Bahar',
    steps: [4, 1, 1, 1, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Homshikha',
    steps: [3, 1, 3, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Madhuri',
    steps: [4, 1, 2, 2, 1, 1, 1],
    aliases: ['Kaamkesh', 'Kamal Ranjani', 'Khokar']
  },
  {
    edo: 12,
    name: 'Raga Milan Gandhar',
    steps: [2, 1, 1, 3, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Pushp Ranjani',
    steps: [1, 3, 1, 1, 1, 4, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Rageshri',
    steps: [2, 2, 1, 4, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Ravikosh',
    steps: [2, 1, 1, 1, 4, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Sorati',
    steps: [2, 3, 2, 2, 1, 1, 1],
    aliases: ['Badhans Sarang', 'Miyan Ki Sarang', 'Samant Sarang', 'Sawani Kedar', 'Sur Malhar (Surdasi Malhar)']
  },
  {
    edo: 12,
    name: 'Oriental',
    steps: [1, 3, 1, 1, 3, 1, 2],
    aliases: ['Raga Ahira-Lalita (Ahir Lalit)', 'Hungarian Minor inverse', 'Tsinganikos: Greece']
  },
  {
    edo: 12,
    name: 'Appalachian',
    steps: [1, 1, 1, 2, 2, 3, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Leading Whole-tone',
    steps: [2, 2, 2, 2, 2, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Leading Whole-tone inverse',
    steps: [1, 1, 2, 2, 2, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Debussy\'s Heptatonic',
    steps: [2, 1, 1, 1, 1, 3, 3],
    aliases: []
  },
  {
    edo: 12,
    name: 'Conway\'s Heptatonic',
    steps: [2, 1, 2, 1, 1, 4, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Araj',
    steps: [1, 3, 1, 2, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Asa Bhairav',
    steps: [1, 1, 2, 1, 2, 2, 2, 1],
    aliases: ['Adi Basant']
  },
  {
    edo: 12,
    name: 'Raga Basant Pancham',
    steps: [1, 3, 1, 1, 1, 1, 3, 1],
    aliases: ['Lalita Gauri', 'Prabhaat Bhairav', 'Ramkali (Ramakri)']
  },
  {
    edo: 12,
    name: 'Raga Bhankar',
    steps: [1, 3, 1, 1, 1, 2, 2, 1],
    aliases: ['Bhatiyar', 'Jaikauns', 'Lalit Pancham', 'Manomanjari', 'Vihang']
  },
  {
    edo: 12,
    name: 'Raga Chandni Bihag',
    steps: [4, 1, 1, 1, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Cintamani',
    steps: [2, 1, 3, 1, 1, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Dhavalshree',
    steps: [1, 3, 2, 1, 1, 1, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Gandhari',
    steps: [1, 1, 1, 2, 2, 1, 2, 2],
    aliases: ['Bahaduri Todi', 'Komal Desi', 'Phrygian/Aeolian mixed']
  },
  {
    edo: 12,
    name: 'Raga Gunji Kanada',
    steps: [2, 1, 1, 1, 2, 1, 2, 2],
    aliases: ['Dev Gandhar']
  },
  {
    edo: 12,
    name: 'Raga Hafiz Kauns',
    steps: [3, 1, 1, 2, 1, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Haunskinkini',
    steps: [2, 1, 1, 1, 2, 2, 2, 1],
    aliases: ['Patdipaki', 'Sawan']
  },
  {
    edo: 12,
    name: 'Raga Hijaj Bhairav',
    steps: [1, 1, 2, 1, 2, 1, 2, 2],
    aliases: ['Jogi Asavari']
  },
  {
    edo: 12,
    name: 'Raga Jogkauns',
    steps: [3, 1, 1, 2, 1, 2, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Lachari Kanada',
    steps: [2, 1, 1, 1, 2, 3, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Lalitavari',
    steps: [1, 1, 2, 1, 1, 3, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Mian Ki Malhar',
    steps: [2, 1, 2, 2, 2, 1, 1, 1],
    aliases: ['Charju Ki Malhar', 'Bahar', 'Bageshri Bahar', 'Barwa', 'Hussaini Todi', 'Lankadahan Sarang', 'Sindhura', 'Sughrai']
  },
  {
    edo: 12,
    name: 'Raga Monomanjari',
    steps: [1, 3, 2, 1, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Mukhari',
    steps: [2, 1, 2, 2, 1, 1, 1, 2],
    aliases: ['Anandabhairavi', 'Deshi (Desi)', 'Kaushik Bahar', 'Khat', 'Manji', 'Gregorian nr.1', 'Dorian/Aeolian mixed']
  },
  {
    edo: 12,
    name: 'Raga Nandavati',
    steps: [2, 2, 1, 1, 1, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Saurashtra',
    steps: [1, 3, 1, 2, 1, 1, 2, 1],
    aliases: ['Saurashtra Bhairav']
  },
  {
    edo: 12,
    name: 'Raga Shankara Karan',
    steps: [2, 2, 2, 1, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Shyam Kedar',
    steps: [2, 3, 1, 1, 2, 1, 1, 1],
    aliases: ['Saraswati Sarang', 'Ambika Sarang']
  },
  {
    edo: 12,
    name: 'Raga Suha Todi',
    steps: [1, 2, 2, 2, 1, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Tanseni Madhuvanti',
    steps: [2, 1, 3, 1, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Viranch Mukhi',
    steps: [2, 1, 1, 1, 1, 1, 4, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Virat Bhairav',
    steps: [1, 3, 1, 2, 1, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Sabach (Sambah): Greece',
    steps: [2, 1, 1, 3, 1, 2, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Minor Bebop',
    steps: [2, 1, 1, 1, 2, 2, 1, 2],
    aliases: ['Dorian Bebop', 'Raga Bheem', 'Khokhar', 'Lankeshwari', 'Malgunji', 'Neelambari', 'Zilla', 'Mixolydian/Dorian mixed', 'Basque']
  },
  {
    edo: 12,
    name: 'Genus diatonicum',
    steps: [2, 2, 1, 2, 2, 1, 1, 1],
    aliases: ['Dominant Bebop', 'Raga Khamaj', 'Alhaiya Bilaval', 'Bihagara', 'Champak', 'Desh Malhar (Des)', 'Devagandhari', 'Dipak', 'Gaud Malhar', 'Jaijaiwante', 'Kukubh Bilawal', 'Lankeshree', 'Malagunji', 'Nat Bihag', 'Nat Malhar', 'Sorath', 'Tilak Malhar', 'Maqam Shawq Awir', 'Gregorian nr.6', 'Chinese Eight-Tone', 'Rast: Greece', 'Ionian/Mixolydian mixed']
  },
  {
    edo: 12,
    name: 'Major Bebop',
    steps: [2, 2, 1, 2, 1, 1, 2, 1],
    aliases: ['Altered Mixolydian']
  },
  {
    edo: 12,
    name: 'Blues scale II',
    steps: [2, 1, 2, 1, 1, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Algerian',
    steps: [2, 1, 2, 1, 1, 1, 3, 1],
    aliases: ['Sabiren', 'Blues Dark Double Harmonic']
  },
  {
    edo: 12,
    name: 'Spanish Phrygian',
    steps: [1, 2, 1, 1, 2, 1, 2, 2],
    aliases: ['Polish']
  },
  {
    edo: 12,
    name: 'Fokker Six-star A',
    steps: [1, 2, 1, 1, 2, 1, 3, 1],
    aliases: ['Raga Devata Bhairav']
  },
  {
    edo: 12,
    name: 'Espla\'s scale',
    steps: [1, 2, 1, 1, 1, 2, 2, 2],
    aliases: ['Eight-tone Spanish']
  },
  {
    edo: 12,
    name: 'Half-diminished Bebop',
    steps: [1, 2, 2, 1, 1, 1, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Locrian Bebop',
    steps: [1, 2, 1, 2, 1, 1, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Neapolitan Major and Minor mixed',
    steps: [1, 2, 2, 2, 1, 1, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Neveseri: Greece',
    steps: [1, 2, 3, 1, 1, 2, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Sideways scale',
    steps: [1, 2, 3, 1, 1, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Diminished',
    steps: [2, 1, 2, 1, 2, 1, 2, 1],
    aliases: ['Modus conjunctus', 'Messiaen mode 2 inverse', 'Whole-Half step scale']
  },
  {
    edo: 12,
    name: 'Ishikotsucho: Japan',
    steps: [2, 2, 1, 1, 1, 2, 2, 1],
    aliases: ['Raga Yaman Kalyan', 'Chayanat', 'Bihag', 'Hamir Kalyani', 'Kedar', 'Khem Kalyan', 'Gaud Sarang', 'Maru Bihag', 'Pat Bihag', 'Sanjh Saravali', 'Genus diatonicum veterum correctum', 'Gregorian nr.5', 'Kubilai\'s Mongol scale', 'Ionian/Lydian mixed']
  },
  {
    edo: 12,
    name: 'Verdi\'s Scala enigmatica',
    steps: [1, 3, 1, 1, 2, 2, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Zirafkend: Arabic',
    steps: [2, 1, 2, 2, 1, 1, 2, 1],
    aliases: ['Melodic Minor Bebop']
  },
  {
    edo: 12,
    name: 'Adonai Malakh: Jewish',
    steps: [1, 1, 1, 2, 2, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Magen Abot: Jewish',
    steps: [1, 2, 1, 2, 2, 1, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Maqam Nahawand',
    steps: [2, 1, 2, 2, 1, 2, 1, 1],
    aliases: ['Farahfaza', 'Raga Suha (Suha Kanada)', 'Gregorian nr.4', 'Utility Minor']
  },
  {
    edo: 12,
    name: 'Harmonic and Neapolitan Minor mixed',
    steps: [1, 1, 1, 2, 2, 1, 3, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Maqam Hijaz (Hedjaz)',
    steps: [1, 3, 1, 2, 1, 2, 1, 1],
    aliases: ['Raga Kabir Bhairav', 'Blues Bright Double Harmonic']
  },
  {
    edo: 12,
    name: 'Maqam Shadd\'araban',
    steps: [1, 2, 1, 1, 1, 3, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Octatonic',
    steps: [1, 2, 1, 2, 1, 2, 1, 2],
    aliases: ['Messiaen mode 2', 'Dominant Diminished', 'Diminished Blues', 'Half-Whole step scale']
  },
  {
    edo: 12,
    name: 'Messiaen mode 4',
    steps: [1, 1, 1, 3, 1, 1, 1, 3],
    aliases: ['Tcherepnin Octatonic mode 3']
  },
  {
    edo: 12,
    name: 'Messiaen mode 4 inverse',
    steps: [3, 1, 1, 1, 3, 1, 1, 1],
    aliases: ['Tcherepnin Octatonic mode 4']
  },
  {
    edo: 12,
    name: 'Messiaen mode 6',
    steps: [1, 1, 2, 2, 1, 1, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Messiaen mode 6 inverse',
    steps: [2, 2, 1, 1, 2, 2, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Tcherepnin Octatonic mode 1',
    steps: [1, 3, 1, 1, 1, 3, 1, 1],
    aliases: ['Duplex genus primum inverse']
  },
  {
    edo: 12,
    name: 'Tcherepnin Octatonic mode 2',
    steps: [1, 1, 3, 1, 1, 1, 3, 1],
    aliases: ['Duplex genus primum']
  },
  {
    edo: 12,
    name: 'Phrygian/Locrian mixed',
    steps: [1, 2, 2, 1, 1, 1, 2, 2],
    aliases: ['Raga Bhairavi']
  },
  {
    edo: 12,
    name: 'Hamel',
    steps: [1, 2, 2, 2, 1, 2, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Van der Horst Octatonic',
    steps: [1, 2, 2, 1, 1, 2, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Prokofiev',
    steps: [1, 2, 2, 1, 2, 2, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Shostakovich',
    steps: [1, 2, 1, 2, 1, 2, 2, 1],
    aliases: ['Raga Marg Hindol']
  },
  {
    edo: 12,
    name: 'JG Octatonic',
    steps: [1, 2, 1, 1, 2, 2, 1, 2],
    aliases: ['Latin-American']
  },
  {
    edo: 12,
    name: 'Jobim\'s Scale',
    steps: [2, 1, 1, 2, 1, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Equal temperaments 4 and 6 mixed',
    steps: [2, 1, 1, 2, 2, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Messiaen mode 3',
    steps: [1, 1, 2, 1, 1, 2, 1, 1, 2],
    aliases: ['Tcherepnin Nonatonic mode 3']
  },
  {
    edo: 12,
    name: 'Messiaen mode 3 inverse',
    steps: [2, 1, 1, 2, 1, 1, 2, 1, 1],
    aliases: ['Tcherepnin Nonatonic mode 2']
  },
  {
    edo: 12,
    name: 'Blues Enneatonic',
    steps: [2, 1, 1, 1, 2, 2, 1, 1, 1],
    aliases: ['Raga Gara', 'Jaijaiwanti', 'Jayant Malhar', 'Hanskinkini', 'Malgunji', 'Nagadhwani Kanada', 'Nilambari', 'Pat Manjiri', 'Rageshri Bahar', 'Ramdasi Malhar', 'Tilang Bahar', 'Zila Kafi', 'Ionian/Dorian mixed']
  },
  {
    edo: 12,
    name: 'Blues Enneatonic II',
    steps: [2, 1, 1, 1, 1, 1, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Full Minor',
    steps: [2, 1, 2, 2, 1, 1, 1, 1, 1],
    aliases: ['Raga Jungala', 'Kanada Bahar', 'Meera Malhar', 'Pilu']
  },
  {
    edo: 12,
    name: 'Raga Abheri Todi',
    steps: [1, 1, 1, 1, 1, 2, 1, 2, 2],
    aliases: ['Devgandhari Todi']
  },
  {
    edo: 12,
    name: 'Raga Ahi Mohini',
    steps: [1, 2, 1, 1, 2, 1, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Basanti Kanada',
    steps: [1, 3, 1, 1, 1, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Bihad Bhairav',
    steps: [1, 2, 1, 1, 2, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Chandranandan',
    steps: [2, 1, 1, 1, 2, 1, 2, 1, 1],
    aliases: ['Enayetkhani Kanada']
  },
  {
    edo: 12,
    name: 'Raga Kabiri Bhairav',
    steps: [1, 3, 1, 2, 1, 1, 1, 1, 1],
    aliases: ['Rati Bhairav']
  },
  {
    edo: 12,
    name: 'Raga Kamod',
    steps: [1, 1, 2, 1, 1, 1, 2, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Khat Todi',
    steps: [1, 2, 2, 1, 1, 1, 2, 1, 1],
    aliases: ['Mangal Todi', 'Adaranga Todi']
  },
  {
    edo: 12,
    name: 'Raga Lalit Mangal',
    steps: [1, 3, 1, 1, 1, 1, 1, 2, 1],
    aliases: ['Purba', 'Saajgiri (Sazgiri)', 'Sonakshi', 'Sourashtra Bhairav']
  },
  {
    edo: 12,
    name: 'Raga Lalitkali',
    steps: [1, 3, 1, 1, 1, 1, 2, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Maru',
    steps: [1, 1, 2, 1, 1, 1, 1, 3, 1],
    aliases: ['Roopkali']
  },
  {
    edo: 12,
    name: 'Raga Nat Kedar',
    steps: [2, 2, 1, 1, 1, 1, 1, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Niranjani Todi',
    steps: [1, 2, 2, 1, 1, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Pahadi',
    steps: [2, 2, 1, 2, 1, 1, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Rang Malhar',
    steps: [2, 1, 2, 1, 1, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Kiourdi: Greece',
    steps: [2, 1, 2, 1, 1, 1, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Taishikicho',
    steps: [2, 2, 1, 1, 1, 2, 1, 1, 1],
    aliases: ['Ryo: Japan', 'Raga Chayanat', 'Kedar', 'Kukubh Bilawal', 'Maluha Kedar', 'Manj Khamaj', 'Medhavi', 'Nat Bilawal', 'Pancham se Gara', 'Pancham se Pilu', 'Saraswati Kedar', 'Suddha Chaya', 'Lydian/Mixolydian mixed']
  },
  {
    edo: 12,
    name: 'Chromatic Bebop',
    steps: [1, 1, 2, 1, 2, 2, 1, 1, 1],
    aliases: ['Raga Bhairav Bahar']
  },
  {
    edo: 12,
    name: 'Locrian/Aeolian mixed',
    steps: [1, 1, 1, 2, 1, 1, 1, 2, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Genus chromaticum',
    steps: [1, 2, 1, 1, 2, 1, 1, 2, 1],
    aliases: ['Tcherepnin Nonatonic mode 1', 'Augmented-9']
  },
  {
    edo: 12,
    name: 'Moorish Phrygian',
    steps: [1, 2, 1, 1, 2, 1, 2, 1, 1],
    aliases: ['Raga Bhavmat Bhairav', 'Shivmat Bhairav', 'Phrygian/Double Harmonic Major mixed']
  },
  {
    edo: 12,
    name: 'Youlan scale: China',
    steps: [1, 1, 2, 1, 1, 1, 2, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Chromatic and Diatonic Dorian mixed',
    steps: [1, 1, 1, 2, 2, 1, 1, 1, 2],
    aliases: ['Raga Amiri Todi']
  },
  {
    edo: 12,
    name: 'Chromatic and Permuted Diatonic Dorian mixed',
    steps: [1, 1, 2, 1, 2, 1, 1, 2, 1],
    aliases: ['Raga Tilak Bhairav']
  },
  {
    edo: 12,
    name: 'Houseini: Greece',
    steps: [2, 1, 1, 1, 2, 1, 1, 1, 2],
    aliases: ['Raga Lachari Todi', 'Rudra Manjiri', 'Modes of Major Pentatonic mixed']
  },
  {
    edo: 12,
    name: 'Duplex genus secundum',
    steps: [1, 2, 1, 1, 1, 1, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Duplex genus secundum inverse',
    steps: [1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Messiaen mode 7',
    steps: [1, 1, 1, 1, 2, 1, 1, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Messiaen mode 7 inverse',
    steps: [2, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Major/Minor mixed',
    steps: [2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    aliases: ['Supermode']
  },
  {
    edo: 12,
    name: 'Minor Pentatonic with leading tones',
    steps: [2, 1, 1, 1, 1, 1, 2, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Maqam Shawq Afza',
    steps: [2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Basanti Kedar',
    steps: [1, 1, 2, 1, 1, 1, 1, 1, 2, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Gambhir Basant',
    steps: [1, 1, 1, 2, 1, 1, 1, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Kaushi Bhairav',
    steps: [1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Lakshmi Todi',
    steps: [1, 1, 1, 1, 1, 2, 1, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Raga Sindhi-Bhairavi',
    steps: [1, 1, 1, 1, 1, 2, 1, 2, 1, 1],
    aliases: ['Jaun Bhairav']
  },
  {
    edo: 12,
    name: 'Maqam Tarzanuyn',
    steps: [1, 2, 1, 1, 1, 1, 1, 1, 1, 2],
    aliases: []
  },
  {
    edo: 12,
    name: 'Symmetrical Decatonic',
    steps: [1, 1, 2, 1, 1, 1, 1, 2, 1, 1],
    aliases: ['Raga Gaurimanjari']
  },
  {
    edo: 12,
    name: 'Raga Paraj Bahar',
    steps: [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    aliases: []
  },
  {
    edo: 12,
    name: 'Twelve-tone Chromatic (1/11-comma)',
    steps: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    aliases: ['Raga Patmanjari']
  }
];