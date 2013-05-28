# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'BenchmarkSession.timestamp'
        db.add_column(u'visualization_benchmarksession', 'timestamp',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, default=datetime.datetime(2013, 5, 27, 0, 0), blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'BenchmarkSession.timestamp'
        db.delete_column(u'visualization_benchmarksession', 'timestamp')


    models = {
        u'visualization.benchcase': {
            'Meta': {'object_name': 'BenchCase'},
            'description': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'slug': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '16'})
        },
        u'visualization.benchmarksession': {
            'Meta': {'object_name': 'BenchmarkSession'},
            'commit': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'data': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'iterations': ('django.db.models.fields.IntegerField', [], {}),
            'testcase': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['visualization.BenchCase']"}),
            'timestamp': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'user_agent': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        u'visualization.benchmarktiming': {
            'Meta': {'object_name': 'BenchmarkTiming'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'session': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'timings'", 'to': u"orm['visualization.BenchmarkSession']"}),
            'timing': ('django.db.models.fields.IntegerField', [], {})
        },
        u'visualization.graph': {
            'Meta': {'object_name': 'Graph'},
            'database': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            'description': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            'thumbnail': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['visualization']