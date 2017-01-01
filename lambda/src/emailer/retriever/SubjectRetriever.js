export default class SubjectRetriever {
  constructor(connection) {
    this.connection = connection;
  }

  async retrieve(subjectId) {
    let queryResult = '';
    const queryHandler = (error, results) => {
      if (error) throw error;
      console.log(`Query returned: ${results}`);
      queryResult = results[0];
      console.log(`Grabbing first item: ${queryResult}`);
    };

    this.connection.query('select subject from subjects where id = ?', [subjectId], queryHandler);

    return queryResult;
  }
}
