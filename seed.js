const db = require('./models');

const NULL = null;
const user = (...args) => {
  const [ id, username, password, role, first_name, last_name, phone, address, email, birthday, picture_url] = args;
  const user = { username, password, role, first_name, last_name, phone, address, email, birthday, picture_url}
  return db.Users.create(user);
}

const course = (...args) => {
  const [course_id, host_id, name, description] = args;
  const course =  { host_id, name, description };
  return db.Courses.create(course);
}

const courseMember = (...args) => {
  const [course_member_id, course_id, user_id, description, status] = args;
  const member = { course_id, user_id, description, status};
  return db.CourseMembers.create(member);
}

const threads = (...args) => {
  const [forum_thread_id, course_id, author_id, title, content, update_at,create_at,] = args;
  const thread = {course_id, author_id, title, content, create_at, update_at};
  return db.ForumThreads.create(thread);
}

const seed = async () => {

  await user('1','username1','$2b$10$vtlA5IiGMWYE1.BZW4nthe27b1wlawLiLmt7AmjN79GPYjs9Yw9N6','Student','first 1','last 1',NULL,NULL,NULL,NULL,"/file/0.jpg");
  await user('2','username2','$2b$10$LdsYxRBtfbgpTzgDKf4ILulIwr09iJqapqJzVY8qcRRA/XV7z5o7W','Student','first 2','last 2',NULL,NULL,NULL,NULL,"/file/0.jpg");
  await user('3','username3','$2b$10$UBNataVcGQ83s.GSg2olU.PnTClaO7csL.TgxMWRVj2W.w.N/U5ae','Student',NULL,NULL,'phone 3',NULL,NULL,NULL,"/file/0.jpg");
  await user('4','username4','$2b$10$SGWvfHfcRtBKDnJ/zZYdee43m5XuzprF1jgSSkDvyOwCcZkN6pAhC','Student',NULL,NULL,NULL,'address 4',NULL,NULL,"/file/0.jpg");
  await user('5','username5','$2b$10$mMK2Vxj0EaNF2tpG5IWGi.06Er9.XaFqwED3OoP6g9m7Szf0Bj37C','Student',NULL,NULL,NULL,NULL,NULL,NULL,"/file/0.jpg");
  await user('6','username6','$2b$10$P57DrkdhtNvR9Rkpr5hqv.rgcuGlHEFqokTEYJEphW3bsQjdaoWji','Student',NULL,NULL,NULL,NULL,NULL,NULL,"/file/0.jpg");
  await user('7','username7','$2b$10$aZkdZDpDFMGSoEnqEGY6ZOVymJtcc4ywc64O3qu3wEXiYb9Xzc70q','Student',NULL,NULL,NULL,NULL,NULL,NULL,"/file/0.jpg");
  await user('8','username8','$2b$10$3yfHAhm0MfxZXFnVTkwsxOOL10lUiGP0h1pnfrVVms7cTjL1Cfysy','Student',NULL,NULL,NULL,NULL,NULL,NULL,"/file/0.jpg");
  await user('9','username9','$2b$10$D1T4tELN2rsbnjX4TYduReTzBEFR9OKeHUo1eRytnqBF.2xqTlp0y','Student',NULL,NULL,NULL,NULL,NULL,NULL,"/file/0.jpg");
  await user('10','username10','$2b$10$8YORPRDtKN7vHeXaGiCpOeNn.nUZu0ITcb8kyB4pmc/jpooOkcYgK','Teacher',NULL,NULL,NULL,NULL,NULL,NULL,"/file/0.jpg");
  await user('11','username11','$2b$10$04ncysEyTBu/AhJa0hg6bOltLOFhInHJAgscH730zpZOWVt2ybCk6','Teacher',NULL,NULL,NULL,NULL,NULL,NULL,"/file/0.jpg");
  await user('12','username12','$2b$10$EphtuMcOE/R8eqlTEAAZp.qNPl8nk2p.8.0Jdu52G7Z.vquucS2xO','Teacher','ABC','DFF',NULL,NULL,NULL,NULL,"/file/0.jpg");

  await course('1', '10', 'Đồ họa máy tính', 'miêu tả môn đồ họa');
  await course('2', '11', 'Quản lý dự án', NULL);
  await course('3', '11', 'Công nghệ phần mềm', 'miêu tả môn cnpm');
  await course('4', '10', 'Lý thuyết thông tin', NULL);
  
  await courseMember('1', '1', '1', NULL, 'Pending');
  await courseMember('2', '1', '2', NULL, 'Pending');
  await courseMember('3', '1', '3', 'Miêu tả cho course member 3', 'Accepted');
  await courseMember('4', '1', '4', NULL, 'Accepted');
  await courseMember('5', '1', '7', 'Miêu tả cho course member 5', 'Rejected');
  await courseMember('6', '2', '1', NULL, 'Pending');
  await courseMember('7', '2', '2', 'Miêu tả cho course member 7', 'Accepted');
  await courseMember('8', '2', '4', NULL, 'Pending');
  await courseMember('9', '2', '5', NULL, 'Accepted');
  await courseMember('10', '2', '6', NULL, 'Pending');
  await courseMember('11', '2', '8', 'Miêu tả cho course member 11', 'Rejected');
  await courseMember('12', '3', '1', NULL, 'Pending');
  await courseMember('13', '3', '2', NULL, 'Accepted');
  await courseMember('14', '4', '5', NULL, 'Accepted');
  await courseMember('15', '4', '6', NULL, 'Pending');

  await threads('1', '2', '2', 'tiêu đề 1', 'nội dung cho 1', '1603957918640', '1603957918640');
  await threads('2', '2', '2', 'tiêu đề 2', 'nội dung cho 2', '1603957918644', '1603957918644');
  await threads('3', '2', '2', 'tiêu đề 3', 'nội dung cho 3', '1603957918652', '1603957918652');
  await threads('4', '2', '2', 'tiêu đề 4', 'nội dung cho 4', '1603957918655', '1603957918655');
  await threads('5', '2', '5', 'tiêu đề 5', 'nội dung cho 5', '1603957918659', '1603957918659');
  await threads('6', '2', '5', 'tiêu đề 6', 'nội dung cho 6', '1603957918662', '1603957918662');
  await threads('7', '2', '5', 'tiêu đề 7', 'nội dung cho 7', '1603957918667', '1603957918667');
  await threads('8', '1', '3', 'tiêu đề 8', 'nội dung cho 8', '1603957918671', '1603957918671');
  await threads('9', '1', '3', 'tiêu đề 9', 'nội dung cho 9', '1603957918674', '1603957918674');
  await threads('10', '1', '3', 'tiêu đề 10', 'nội dung cho 10', '1603957918678', '1603957918678');
  await threads('11', '1', '3', 'tiêu đề 11', 'nội dung cho 11', '1603957918681', '1603957918681');
  await threads('12', '3', '2', 'tiêu đề 12', 'nội dung cho 12', '1603957918686', '1603957918686');
  await threads('13', '3', '2', 'tiêu đề 13', 'nội dung cho 13', '1603957918689', '1603957918689');



}
module.exports = seed;