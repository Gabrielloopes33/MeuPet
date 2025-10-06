# Como Adicionar Suas Fotos

## 📁 Passos para adicionar suas imagens:

1. **Renomeie suas fotos** para:
   - `slide1.jpg` (primeira foto - tema principal do cuidado)
   - `slide2.jpg` (segunda foto - lembretes/medicamentos)
   - `slide3.jpg` (terceira foto - serviços veterinários)

2. **Coloque as fotos** nesta pasta (`assets/images/onboarding/`)

3. **Formatos aceitos**: `.jpg`, `.jpeg`, `.png`

4. **Tamanho recomendado**: 
   - Largura: 500-1000px
   - Altura: 400-800px
   - Proporção: aproximadamente 5:4 (landscape)

## 🖼️ Dicas para melhores fotos:

- **Slide 1**: Foto de pet feliz com dono/veterinário
- **Slide 2**: Foto relacionada a medicamentos ou consulta
- **Slide 3**: Foto de clínica veterinária ou serviços

## 🔧 Se quiser usar outros formatos:

Você pode alterar as extensões no arquivo `login.tsx`:
```typescript
image: require('../assets/images/onboarding/slide1.png') // Para PNG
```

## 🌐 Alternativa - URLs da internet:

Se preferir usar fotos da internet, mude de volta para:
```typescript
image: { uri: "https://sua-url-da-foto.com/image.jpg" }
```