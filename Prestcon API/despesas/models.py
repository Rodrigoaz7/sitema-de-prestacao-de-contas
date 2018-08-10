from django.db import models
from bank.models import Bank_account
from cheque.models import Cheque
from decimal import Decimal
import datetime


class Despesa(models.Model):

    # Tipo de Despesa
    MAT = 'Material'
    SER = 'Serviço'
    despesa_choice = (
        (MAT, 'Material'),
        (SER, 'Serviço')
    )

    # Tipo de Documento
    NOT = 'Nota Fiscal'
    FAT = 'Fatura'
    REC = 'Recibo'

    documento_choice = (
        (NOT, 'Nota Fiscal'),
        (FAT, 'Fatura'),
        (REC, 'Recibo')
    )

    # Tipo de Nota Fiscal
    MAN = 'Manual'
    ELE = 'Eletrônica'

    nota_fiscal_choice = (
        (MAN, 'Manual'),
        (ELE, 'Eletrônica')
    )

    vigencia = models.ForeignKey('vigencia.Vigencia', on_delete=models.CASCADE, null=True, related_name="vigencia_despesa", verbose_name="Vigência da despesa")
    school = models.ForeignKey('school.School', on_delete=models.CASCADE, related_name="despesas", verbose_name="Escola")
    fornecedor = models.ForeignKey('fornecedor.Fornecedor', on_delete=models.CASCADE, related_name="fornecedor", verbose_name="Fornecedores")
    bank = models.ForeignKey('bank.Bank_account', on_delete=models.SET_NULL, related_name="conta_bancaria", verbose_name="Conta bancária", null=True)
    num_comprovante_pag = models.CharField('Número do comprovante de pagamento', max_length=100)
    data_comprovante_pag = models.CharField('Data do comprovante de pagamento', max_length=10)
    #bloco_cheque = models.ForeignKey('cheque.BlocoCheques', on_delete=models.CASCADE, related_name="bloco_cheque", verbose_name="Bloco de Cheques", null=True, blank=True)
    #cheque = models.ForeignKey('cheque.Cheque', on_delete=models.CASCADE, related_name="cheque", verbose_name="Cheque", null=True, blank=True)
    
    tipo_despesa = models.CharField(max_length=20, choices=despesa_choice, default=MAT, verbose_name="Tipo de Despesa")
    tipo_documento = models.CharField(max_length=20, choices=documento_choice, default=NOT, verbose_name="Tipo de Documento")
    tipo_nota_fiscal = models.CharField(max_length=20, choices=nota_fiscal_choice, default=MAN, verbose_name="Tipo de Nota Fiscal")
    
    file_tipo_documento = models.FileField("Arquivo de documento", upload_to='uploads/certificados/nf_or_fat', null=True, blank=True)
    #Arquivo de recibo (precisa existir em todas as despesas, porem, eh opcional)
    file_recibo = models.FileField("Arquivo de recibo", upload_to='uploads/certificados/recibos', null=True, blank=True)
    file_comprovante = models.FileField("Arquivo do cheque", upload_to='uploads/certificados/comprovantes',null=True, blank=True)
    file_proposta1 = models.FileField("Arquivo de proposta #1", upload_to='uploads/certificados/propostas', null=True, blank=True)
    file_proposta2 = models.FileField("Arquivo de proposta #2", upload_to='uploads/certificados/propostas', null=True, blank=True)
    file_proposta3 = models.FileField("Arquivo de proposta #3", upload_to='uploads/certificados/propostas', null=True, blank=True)
    file_outros = models.FileField("Arquivo de outros documentos", upload_to='uploads/certificados/outros', null=True, blank=True)
    
    is_auditada = models.BooleanField("Despesa auditada", default=False)
    created = models.DateTimeField('Criado em', auto_now_add=True)

    #retornando o numero da conta bancária para chave estrangeira
    def __str__(self):
        return '#{0} - {1}'.format(self.id, self.school.name)

    class Meta:
        verbose_name = 'Despesa'
        verbose_name_plural = 'Despesas'


# class NotaFiscalManual(models.Model):

#     despesa = models.ForeignKey(Despesa, on_delete=models.CASCADE, related_name="despesa_nf_manual", verbose_name="Notas Fiscais Manuais")
#     created = models.DateTimeField('Criado em', auto_now_add=True)

#     def __str__(self):
#         return str(self.pk)

#     class Meta:
#         verbose_name = 'Nota Fiscal Manual'
#         verbose_name_plural = 'Notas Fiscais Manuais'


# class NotaFiscalEletronica(models.Model):

#     despesa = models.ForeignKey(Despesa, on_delete=models.CASCADE, related_name="despesa_nfe", verbose_name="Notas Fiscais Eletrônicas")
#     created = models.DateTimeField('Criado em', auto_now_add=True)
#     #code = models.CharField('Código de Barras do DANFE', max_length=100)

#     def __str__(self):
#         return str(self.pk)

#     class Meta:
#         verbose_name = 'Nota Fiscal Eletrônica'
#         verbose_name_plural = 'Notas Fiscais Eletrônicas'

# class Recibo(models.Model):

#     despesa = models.ForeignKey(Despesa, on_delete=models.CASCADE, related_name="despesa_recibo", verbose_name="Despesa")
#     created = models.DateTimeField('Criado em', auto_now_add=True)

#     def __str__(self):
#         return str(self.pk)

#     class Meta:
#         verbose_name = 'Recibo'
#         verbose_name_plural = 'Recibos'

# class Fatura(models.Model):

#     despesa = models.ForeignKey(Despesa, on_delete=models.CASCADE, related_name="despesa_fatura", verbose_name="Despesa")
#     created = models.DateTimeField('Criado em', auto_now_add=True)
    
#     def __str__(self):
#         return str(self.pk) + ' - Fatura'

#     class Meta:
#         verbose_name = 'Fatura'
#         verbose_name_plural = 'Faturas'

class ProdutoNfelet(models.Model):

    name = models.CharField('produto', max_length=80)
    valor_total = models.DecimalField('Valor em reais', max_digits=8, decimal_places=2, default=Decimal(0))
    valor_unitario = models.DecimalField('Valor em reais', max_digits=8, decimal_places=2, default=Decimal(0))
    unidades = models.IntegerField('Quantidade')
    tipo_unidade = models.CharField('Unidade', max_length=20, default="")
    cfop = models.CharField('CFOP', max_length=20, default="")
    o_cst = models.CharField('O/CST', max_length=20, default="")
    ncm_sh = models.CharField('NCM_SH', max_length=20, default="")

    despesa = models.ForeignKey(Despesa, null=True, blank=True, on_delete=models.CASCADE, related_name="despesa_nfe", verbose_name="Produtos")

class ProdutoNf(models.Model):

    name = models.CharField('produto', max_length=80)
    valor_total = models.DecimalField('Valor em reais', max_digits=8, decimal_places=2, default=Decimal(0))
    valor_unitario = models.DecimalField('Valor em reais', max_digits=8, decimal_places=2, default=Decimal(0))
    unidades = models.IntegerField('Quantidade')
    tipo_unidade = models.CharField('Unidade', max_length=20, default="")

    despesa = models.ForeignKey(Despesa, null=True, blank=True, on_delete=models.CASCADE, related_name="despesa_nfm", verbose_name="Produtos")


class ProdutoRec(models.Model):

    name = models.CharField('produto', max_length=80)
    valor_total = models.DecimalField('Valor em reais', max_digits=8, decimal_places=2, default=Decimal(0))
    valor_unitario = models.DecimalField('Valor em reais', max_digits=8, decimal_places=2, default=Decimal(0))
    unidades = models.IntegerField('Quantidade')
    tipo_unidade = models.CharField('Unidade', max_length=20, default="")

    despesa = models.ForeignKey(Despesa, null=True, blank=True, on_delete=models.CASCADE, related_name="despesa_rec", verbose_name="Produtos")


class ProdutoFat(models.Model):

    name = models.CharField('produto', max_length=80)
    valor_total = models.DecimalField('Valor em reais', max_digits=8, decimal_places=2, default=Decimal(0))
    valor_unitario = models.DecimalField('Valor em reais', max_digits=8, decimal_places=2, default=Decimal(0))
    unidades = models.IntegerField('Quantidade')
    tipo_unidade = models.CharField('Unidade', max_length=20, default="")

    despesa = models.ForeignKey(Despesa, null=True, blank=True, on_delete=models.CASCADE, related_name="despesa_fat", verbose_name="Produtos")
