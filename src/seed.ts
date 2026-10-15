// Added seed demo data for meetings, CBT questions, and kanban on first load
(function seed(){
  try{
    if(!localStorage.getItem('deeset_demo_seeded')){
      const meetings = [{
        id: 'seed1',
        title: 'Intro to Quantum Computing',
        hostName: 'Dr. Ada',
        hostEmail: 'ada@university.edu',
        scheduledAt: new Date(Date.now()+1000*60*60*2).toISOString(),
        platform: 'google',
        meetingLink: 'https://meet.google.com',
        createdAt: new Date().toISOString(),
      }];
      localStorage.setItem('deeset_live_meetings', JSON.stringify(meetings));
      localStorage.setItem('deeset_kanban', JSON.stringify([{id:'k1',title:'Syllabus update',status:'todo'}]));
      localStorage.setItem('deeset_cbt_questions', JSON.stringify([{question:'What is 2+2?', options:['3','4','5'], answer:'4'}]));
      localStorage.setItem('deeset_demo_seeded', '1');
    }
  }catch{}
})();
