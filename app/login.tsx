import { useAuth } from './context/AuthContext';
import api from './services/api';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const slidesData = [
  {
    id: 1,
    title: "Cuidar de\nSeu melhor amigo.",
    subtitle: "Acompanhe a saúde do seu animal de estimação facilmente, mantenha registros médicos organizados.",
    image: require('../assets/images/onboarding/slide1.png') // Coloque sua primeira foto aqui
  },
  {
    id: 2,
    title: "Lembretes\nInteligentes",
    subtitle: "Obtenha lembretes quando é hora de dar o remédio, vacinas ou consultas veterinárias.",
    image: require('../assets/images/onboarding/slide2.png') // Coloque sua segunda foto aqui
  },
  {
    id: 3,
    title: "Serviços\nPróximos",
    subtitle: "Encontre rapidamente serviços relacionados a animais de estimação nas proximidades.",
    image: require('../assets/images/onboarding/slide3.png') // Coloque sua terceira foto aqui
  }
];

export default function Login() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const slideAnimation = useState(new Animated.Value(0))[0];

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const handleGetStarted = () => {
    setShowLoginForm(true);
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  const handleBackToSlides = () => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start(() => {
      setShowLoginForm(false);
    });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha e-mail e senha.');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { accessToken } = response.data;
      
      // Usar o contexto para fazer o login
      signIn(accessToken);

    } catch (error) {
      console.error('Erro de login:', error);

      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || 'Credenciais inválidas.';
        Alert.alert('Erro de Login', errorMessage);
      } else {
        Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
      }
    }
  };

  const handleGoogleLogin = () => {
    // Implementar login com Google
    console.log('Google Login');
  };

  const handleFacebookLogin = () => {
    // Implementar login com Facebook
    console.log('Facebook Login');
  };

  const animatedHeight = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['40%', '85%'],
  });

  const backgroundOpacity = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A5FE7" />
      
      {/* Header da tela de login */}
      {showLoginForm && (
        <Animated.View style={[styles.loginHeader, { opacity: slideAnimation }]}>
          <TouchableOpacity onPress={handleBackToSlides} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerText}>Não tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.headerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Logo */}
      {showLoginForm && (
        <Animated.View style={[styles.logoContainer, { opacity: slideAnimation }]}>
          <Text style={styles.logoText}>MeuPet - logo</Text>
        </Animated.View>
      )}

      {/* Conteúdo principal */}
      <View style={styles.mainContent}>
        {/* ScrollView horizontal para os slides */}
        <Animated.View style={[styles.slidesContainer, { opacity: backgroundOpacity }]}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            style={styles.scrollView}
            scrollEnabled={!showLoginForm}
          >
            {slidesData.map((slide, index) => (
              <View key={slide.id} style={styles.slide}>
                {/* Imagem de fundo */}
                <Image
                  source={slide.image}
                  style={styles.backgroundImage}
                />
                
                {/* Overlay semitransparente (opcional) */}
                <View style={styles.overlay} />

                {/* Quadro branco com conteúdo */}
                <View style={styles.whiteCard}>
                  {/* Texto principal */}
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.subtitle}>{slide.subtitle}</Text>
                  </View>

                  {/* Indicadores de página */}
                  <View style={styles.pageIndicators}>
                    {slidesData.map((_, indicatorIndex) => (
                      <View
                        key={indicatorIndex}
                        style={[
                          styles.indicator,
                          currentSlide === indicatorIndex && styles.activeIndicator
                        ]}
                      />
                    ))}
                  </View>

                  {/* Botão Get Started - só aparece no último slide */}
                  {index === slidesData.length - 1 && (
                    <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
                      <Text style={styles.getStartedText}>Acesse agora</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Tela de Login Animada */}
        <Animated.View 
          style={[
            styles.loginContainer,
            {
              height: animatedHeight,
              transform: [{
                translateY: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [500, 0],
                })
              }]
            }
          ]}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.loginContent}
          >
            <View style={styles.loginForm}>
              <Text style={styles.welcomeTitle}>Bem-vindo de volta</Text>
              <Text style={styles.welcomeSubtitle}>Digite seus dados abaixo</Text>

              {/* Campo de Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Endereço de Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Campo de Senha */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Senha</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••••••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Botão de Login */}
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Entrar</Text>
              </TouchableOpacity>

              {/* Esqueceu a senha */}
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
              </TouchableOpacity>

              {/* Divisor */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Ou entre com</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Botões de redes sociais */}
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                  <Text style={styles.socialIcon}>G</Text>
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
                  <Text style={styles.socialIcon}>f</Text>
                  <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A5FE7', // Azul roxo como na imagem
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  bar: {
    width: 3,
    backgroundColor: '#333',
    borderRadius: 1,
  },
  bar1: { height: 4 },
  bar2: { height: 6 },
  bar3: { height: 8 },
  bar4: { height: 10 },
  wifi: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#333',
  },
  battery: {
    width: 25,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#333',
    marginLeft: 5,
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  loginHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 14,
  },
  headerLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logoText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  slidesContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(24, 83, 116, 0.3)'
  },



  whiteCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 15,
    width: '100%',
    alignItems: 'center',
    minHeight: 320,
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  pageIndicators: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#428DD8',
    opacity: 0.5,
  },
  activeIndicator: {
    backgroundColor: '#4A90E2',
    opacity: 1,
  },
  getStartedButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  loginContent: {
    flex: 1,
  },
  loginForm: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  eyeIcon: {
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: '#4A5FE7',
    borderRadius: 25,
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#4A5FE7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPassword: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    color: '#666',
    fontSize: 14,
    paddingHorizontal: 15,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F8F9FA',
    gap: 8,
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
