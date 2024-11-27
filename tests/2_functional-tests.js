const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Issue = require('../models');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    suite('POST request', () => {
        test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'Test Title',
                    issue_text: 'Test Text for the issue',
                    created_by: 'Zaid',
                    assigned_to: 'Raghad',
                    status_text: 'In Progress',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'Test Title');
                    assert.equal(res.body.issue_text, 'Test Text for the issue');
                    assert.equal(res.body.created_by, 'Zaid');
                    assert.equal(res.body.assigned_to, 'Raghad');
                    assert.equal(res.body.status_text, 'In Progress');
                    assert.isTrue(res.body.open);
                    done();
                });
        });
        test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'Test Title',
                    issue_text: 'Test Text for the issue',
                    created_by: 'Zaid',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'Test Title');
                    assert.equal(res.body.issue_text, 'Test Text for the issue');
                    assert.equal(res.body.created_by, 'Zaid');
                    assert.isTrue(res.body.open);
                    done();
                });
        });
        test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    created_by: 'Zaid',
                    assigned_to: 'Raghad',
                    status_text: 'In Progress',
                })
                .end((err, res) => {
                    assert.equal(res.body.error, 'required field(s) missing');
                    done();
                });
        });
    });
    suite('GET request', () => {
        test('View issues on a project: GET request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .get('/api/issues/apitest')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    if (res.body.length > 0) {
                        const issue = res.body[0];
                        assert.property(issue, '_id');
                        assert.property(issue, 'issue_title');
                        assert.property(issue, 'issue_text');
                        assert.property(issue, 'created_by');
                        assert.property(issue, 'assigned_to');
                        assert.property(issue, 'status_text');
                        assert.property(issue, 'open');
                        assert.property(issue, 'created_on');
                        assert.property(issue, 'updated_on');
                    }
                    done();
                });
        });
        test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .get('/api/issues/apitest?assigned_to=Raghad')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    if (res.body.length > 0) {
                        for (i in res.body) {
                            const issue = res.body[i];
                            assert.equal(issue.assigned_to, 'Raghad');
                            assert.property(issue, '_id');
                            assert.property(issue, 'issue_title');
                            assert.property(issue, 'issue_text');
                            assert.property(issue, 'created_by');
                            assert.property(issue, 'status_text');
                            assert.property(issue, 'open');
                            assert.property(issue, 'created_on');
                            assert.property(issue, 'updated_on');
                        }
                    }
                    done();
                });
        });
        test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .get('/api/issues/apitest?assigned_to=Raghad&open=true')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    if (res.body.length > 0) {
                        for (i in res.body) {
                            const issue = res.body[i];
                            assert.equal(issue.assigned_to, 'Raghad');
                            assert.equal(issue.open, true);
                            assert.property(issue, '_id');
                            assert.property(issue, 'issue_title');
                            assert.property(issue, 'issue_text');
                            assert.property(issue, 'created_by');
                            assert.property(issue, 'status_text');
                            assert.property(issue, 'created_on');
                            assert.property(issue, 'updated_on');
                        }
                    }
                    done();
                });
        });
    });
    suite('PUT request', () => {
        test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: '673e707efa2f6989a1632806',
                    issue_text: 'Updated Text for the issue',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body._id, '673e707efa2f6989a1632806')
                    assert.equal(res.body.result, 'successfully updated');
                    done();
                });
        });
        test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: '673e707efa2f6989a1632806',
                    issue_text: 'Updated Text for the issue',
                    status_text: 'rejected',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body._id, '673e707efa2f6989a1632806')
                    assert.equal(res.body.result, 'successfully updated');
                    done();
                });
        });
        test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    issue_title: 'Updated title',
                })
                .end((err, res) => {
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });
        test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: '673e707efa2f6989a1632806',
                })
                .end((err, res) => {
                    assert.equal(res.body.error, 'no update field(s) sent');
                    done();
                });
        });
        test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: 'invalid id',
                    issue_text: 'updated text',
                })
                .end((err, res) => {
                    assert.equal(res.body.error, 'could not update');
                    done();
                });
        });
    });
    suite('DELETE request', () => {
        test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
            const toDelete = new Issue({
                project: 'apitest',
                issue_title: 'To Delete',
                issue_text: 'this is a test issue to be deleted',
                created_by: 'Zaid',
            })
                .save()
                .then((savedIssue) => {
                    chai
                        .request(server)
                        .delete('/api/issues/apitest')
                        .send({
                            _id: savedIssue._id,
                        })
                        .end((err, res) => {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.result, 'successfully deleted');
                            assert.equal(res.body._id, savedIssue._id);
                            done();
                        });
                })
        });
        test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({
                    _id: 'invalid id',
                })
                .end((err, res) => {
                    assert.equal(res.body.error, 'could not delete');
                    assert.equal(res.body._id, 'invalid id');
                    done();
                });
        });
        test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .end((err, res) => {
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });
    });
});
