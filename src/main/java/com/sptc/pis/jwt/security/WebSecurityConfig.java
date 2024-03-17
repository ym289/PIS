package com.sptc.pis.jwt.security;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.sptc.pis.jwt.security.AuthEntryPointJwt;
import com.sptc.pis.jwt.security.AuthTokenFilter;
import com.sptc.pis.jwt.services.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
		// securedEnabled = true,
		// jsr250Enabled = true,
		prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	UserDetailsServiceImpl userDetailsService;

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	public void configure(AuthenticationManagerBuilder authenticationManagerBuilder, DataSource dataSource) throws Exception {
		authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
		authenticationManagerBuilder.jdbcAuthentication().dataSource(dataSource);
	}

	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().and().headers().frameOptions().disable().and().csrf().disable()
			.exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
			.authorizeRequests().antMatchers("/api/auth/**").permitAll()
			.antMatchers("/index.html").permitAll()
			.antMatchers("/login").permitAll()
			.antMatchers("/h2-console/**").permitAll()//allow h2 console access to admins only
			.antMatchers("/").permitAll()
			.antMatchers("/static/**").permitAll()
			.antMatchers("/register").permitAll()
			.antMatchers("/logout").permitAll()
			.antMatchers("/checkConnection").permitAll()
			.antMatchers("/send").permitAll()
			.antMatchers("/events").permitAll()
			.antMatchers("/ws-message/**").permitAll()
			.antMatchers("/preview/pdf/**").permitAll()
			.antMatchers("/get-heatmap/**").permitAll()
			.antMatchers("/get-outline/**").permitAll()
			.antMatchers("/get-dicom-image/**").permitAll()
			.antMatchers("/studies/**").permitAll()
			.antMatchers("/get-initial-array").permitAll()

			.antMatchers("/getBoundingBoxes/**").permitAll()
			.antMatchers("/favicon.ico").permitAll()
			.antMatchers("/console").permitAll()			
			.anyRequest().authenticated();

		http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
		
	}
}
