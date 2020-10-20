const db = require('./models');

const NULL = null;
const user = (...args) => {
  const [ id, username, password, role, first_name, last_name, phone, address, email, birthday, picture_url] = args;
  return { username, password, role, first_name, last_name, phone, address, email, birthday, picture_url}
}

const course = (...args) => {
  const [course_id, host_id, name, description] = args;
  return { host_id, name, description }
}

const courseMember = (...args) => {
  const [course_member_id, course_id, user_id, description, status] = args;
  return { course_id, user_id, description, status}
}

const seed = async () => {

  await db.Users.create(user('1','username1','$2b$10$vtlA5IiGMWYE1.BZW4nthe27b1wlawLiLmt7AmjN79GPYjs9Yw9N6','Student','first 1','last 1',NULL,NULL,NULL,NULL,NULL));
  await db.Users.create(user('2','username2','$2b$10$LdsYxRBtfbgpTzgDKf4ILulIwr09iJqapqJzVY8qcRRA/XV7z5o7W','Student','first 2','last 2',NULL,NULL,NULL,NULL,NULL));
  await db.Users.create(user('3','username3','$2b$10$UBNataVcGQ83s.GSg2olU.PnTClaO7csL.TgxMWRVj2W.w.N/U5ae','Student',NULL,NULL,'phone 3',NULL,NULL,NULL,NULL));
  await db.Users.create(user('4','username4','$2b$10$SGWvfHfcRtBKDnJ/zZYdee43m5XuzprF1jgSSkDvyOwCcZkN6pAhC','Student',NULL,NULL,NULL,'address 4',NULL,NULL,NULL));
  await db.Users.create(user('5','username5','$2b$10$mMK2Vxj0EaNF2tpG5IWGi.06Er9.XaFqwED3OoP6g9m7Szf0Bj37C','Student',NULL,NULL,NULL,NULL,NULL,NULL,NULL));
  await db.Users.create(user('6','username6','$2b$10$P57DrkdhtNvR9Rkpr5hqv.rgcuGlHEFqokTEYJEphW3bsQjdaoWji','Student',NULL,NULL,NULL,NULL,NULL,NULL,NULL));
  await db.Users.create(user('7','username7','$2b$10$aZkdZDpDFMGSoEnqEGY6ZOVymJtcc4ywc64O3qu3wEXiYb9Xzc70q','Student',NULL,NULL,NULL,NULL,NULL,NULL,NULL));
  await db.Users.create(user('8','username8','$2b$10$3yfHAhm0MfxZXFnVTkwsxOOL10lUiGP0h1pnfrVVms7cTjL1Cfysy','Student',NULL,NULL,NULL,NULL,NULL,NULL,NULL));
  await db.Users.create(user('9','username9','$2b$10$D1T4tELN2rsbnjX4TYduReTzBEFR9OKeHUo1eRytnqBF.2xqTlp0y','Student',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL));
  await db.Users.create(user('11','username11','$2b$10$04ncysEyTBu/AhJa0hg6bOltLOFhInHJAgscH730zpZOWVt2ybCk6','Teacher',NULL,NULL,NULL,NULL,NULL,NULL,NULL));
  await db.Users.create(user('12','username12','$2b$10$EphtuMcOE/R8eqlTEAAZp.qNPl8nk2p.8.0Jdu52G7Z.vquucS2xO','Teacher','ABC','DFF',NULL,NULL,NULL,NULL,NULL));
  
  await db.Courses.create(course('1', '10', 'Đồ họa máy tính', 'miêu tả môn đồ họa'));
  await db.Courses.create(course('2', '11', 'Quản lý dự án', NULL));
  await db.Courses.create(course('3', '11', 'Công nghệ phần mềm', 'miêu tả môn cnpm'));
  await db.Courses.create(course('4', '10', 'Lý thuyết thông tin', NULL));
  
  await db.CourseMembers.create(courseMember('1', '1', '1', NULL, 'Pending'));
  await db.CourseMembers.create(courseMember('2', '1', '2', NULL, 'Pending'));
  await db.CourseMembers.create(courseMember('3', '1', '3', 'Miêu tả cho course member 3', 'Accepted'));
  await db.CourseMembers.create(courseMember('4', '1', '4', NULL, 'Accepted'));
  await db.CourseMembers.create(courseMember('5', '1', '7', 'Miêu tả cho course member 5', 'Rejected'));
  await db.CourseMembers.create(courseMember('6', '2', '1', NULL, 'Pending'));
  await db.CourseMembers.create(courseMember('7', '2', '4', 'Miêu tả cho course member 7', 'Accepted'));
  await db.CourseMembers.create(courseMember('8', '2', '2', NULL, 'Pending'));
  await db.CourseMembers.create(courseMember('9', '2', '8', NULL, 'Accepted'));
  await db.CourseMembers.create(courseMember('10', '2', '6', NULL, 'Pending'));
  await db.CourseMembers.create(courseMember('11', '2', '5', 'Miêu tả cho course member 11', 'Rejected'));


  return;
};

module.exports = seed;