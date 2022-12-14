const redis = require('redis');
var zip = new require('node-zip')();
var _ = require('lodash');

const express = require('express');
const router = express.Router();
const celery = require('celery-node');

const r = redis.createClient({ url: 'redis://redis:6379/0', 'return_buffers': true, detect_buffers: true });
(async() => {
    await r.connect();
})();

r.on('error', (err) => console.log('Redis Client Error', err));
r.on('connect',() => {
    console.log('connected to redis successfully!');
});

client = celery.createClient(
    'amqp://guest:guest@rabbitmq:5672//',
    'redis://redis:6379/0'
);

/* POST upload png file. */
router.post('/', function (req, res, next) {
    let icon = req.files.icon
    const task = client.createTask("tasks.resize_image");
    const task_results = task.applyAsync([icon]);
    res.send({'data':task_results.taskId})
    task_results.get().then(results => {
        (async() => {
            let images = await r.mGet(redis.commandOptions({ returnBuffers: true }), results['data']);
            let image_dict = _.zipObject(results['data'], images);
            _.forOwn(image_dict, function(value, key) { 
                key = _.last(key.split("/"));
                zip.file(`${key}.png`, value, {binary: true}); // shouldnt hardcode png
            });
            var data = zip.generate({type: 'nodebuffer'});
            await r.set(`zip/${task_results.taskId}`, data);
        })();
    });
});

router.get('/:taskId', async function(req, res, next) {
    let file = await r.get(redis.commandOptions({ returnBuffers: true }), `zip/${req.params.taskId}`)
    const fileName = 'icons.zip';
    res.writeHead(200,{ 
            'Content-Type': `application/zip`, 
            'Content-Disposition': `attachment; filename="${fileName}"` })
    res.end(file)
});

module.exports = router;
