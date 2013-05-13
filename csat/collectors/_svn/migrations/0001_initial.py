# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'SvnConfig'
        db.create_table(u'svn_svnconfig', (
            (u'datacollectorconfig_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['acquisition.DataCollectorConfig'], unique=True, primary_key=True)),
            ('repository_url', self.gf('django.db.models.fields.URLField')(max_length=200)),
        ))
        db.send_create_signal(u'svn', ['SvnConfig'])


    def backwards(self, orm):
        # Deleting model 'SvnConfig'
        db.delete_table(u'svn_svnconfig')


    models = {
        u'acquisition.acquisitionsessionconfig': {
            'Meta': {'object_name': 'AcquisitionSessionConfig'},
            'description': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '64'})
        },
        u'acquisition.datacollectorconfig': {
            'Meta': {'object_name': 'DataCollectorConfig'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'polymorphic_ctype': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'polymorphic_acquisition.datacollectorconfig_set'", 'null': 'True', 'to': u"orm['contenttypes.ContentType']"}),
            'session_config': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['acquisition.AcquisitionSessionConfig']"})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'svn.svnconfig': {
            'Meta': {'object_name': 'SvnConfig', '_ormbases': [u'acquisition.DataCollectorConfig']},
            u'datacollectorconfig_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['acquisition.DataCollectorConfig']", 'unique': 'True', 'primary_key': 'True'}),
            'repository_url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['svn']