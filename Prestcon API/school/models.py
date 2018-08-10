from django.db import models
from accounts.models import User
#Nao consegui usar
#from multiselectfield import MultiSelectField

class School(models.Model):

    MU = 'municipal'
    ET = 'estadual'
    school_type_choice = (
        (MU, 'municipal'),
        (ET, 'estadual'),
    )

    name = models.CharField('Nome da unidade executora', max_length=100)
    #slug = models.SlugField('Identificador', max_length=100)
    cnpj = models.CharField('CNPJ', max_length=18)
    code = models.CharField('Código da unidade executora', max_length=100)
    type_school = models.CharField(max_length=30, verbose_name="Tipo de escola")
    classification_school = models.CharField(max_length=10, choices=school_type_choice, default=MU, verbose_name="Classificação da escola")
    director = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name="director_school", 
        verbose_name="Diretor da escola", default="diretor", db_column='director', null=True)
    vigencia = models.ForeignKey('vigencia.Vigencia', on_delete=models.CASCADE, null=True, related_name="vigencia_school", verbose_name="Vigência da escola")
    state = models.CharField('Estado', null=True, blank=True, max_length=30)
    city = models.CharField('Cidade', null=True, blank=True, max_length=30, default="")
    created = models.DateTimeField('Criado em', auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Escola'
        verbose_name_plural = 'Escolas'

