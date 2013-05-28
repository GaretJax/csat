# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'BenchmarkTiming'
        db.create_table(u'visualization_benchmarktiming', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('session', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['visualization.BenchmarkSession'])),
            ('timing', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'visualization', ['BenchmarkTiming'])

        # Adding model 'BenchmarkSession'
        db.create_table(u'visualization_benchmarksession', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('testcase', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['visualization.BenchCase'])),
            ('commit', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('data', self.gf('django.db.models.fields.TextField')()),
            ('user_agent', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('iterations', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'visualization', ['BenchmarkSession'])

        # Adding model 'BenchCase'
        db.create_table(u'visualization_benchcase', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'visualization', ['BenchCase'])


    def backwards(self, orm):
        # Deleting model 'BenchmarkTiming'
        db.delete_table(u'visualization_benchmarktiming')

        # Deleting model 'BenchmarkSession'
        db.delete_table(u'visualization_benchmarksession')

        # Deleting model 'BenchCase'
        db.delete_table(u'visualization_benchcase')


    models = {
        u'visualization.benchcase': {
            'Meta': {'object_name': 'BenchCase'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'visualization.benchmarksession': {
            'Meta': {'object_name': 'BenchmarkSession'},
            'commit': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'data': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'iterations': ('django.db.models.fields.IntegerField', [], {}),
            'testcase': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['visualization.BenchCase']"}),
            'user_agent': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        u'visualization.benchmarktiming': {
            'Meta': {'object_name': 'BenchmarkTiming'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'session': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['visualization.BenchmarkSession']"}),
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